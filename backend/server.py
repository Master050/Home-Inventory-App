from fastapi import FastAPI, APIRouter, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Annotated
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import os
import logging
import httpx
import uuid
from pathlib import Path
import jwt
import bcrypt
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ─── DB ───────────────────────────────────────────────────────────────────────
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Astra AI API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ─── AUTH CONFIG ──────────────────────────────────────────────────────────────
JWT_SECRET = os.environ.get("JWT_SECRET", "home-inventory-secret-key-2026")
JWT_ALGORITHM = "HS256"
security = HTTPBearer()

# Hardcoded users (passwords are hashed with bcrypt)
USERS_DB = {
    "ADMIN": {
        "username": "ADMIN",
        "password_hash": bcrypt.hashpw("223344".encode(), bcrypt.gensalt()).decode(),
        "role": "admin"
    },
    "Mãe": {
        "username": "Mãe",
        "password_hash": bcrypt.hashpw("123456".encode(), bcrypt.gensalt()).decode(),
        "role": "viewer"
    },
    "Pai": {
        "username": "Pai",
        "password_hash": bcrypt.hashpw("123456".encode(), bcrypt.gensalt()).decode(),
        "role": "viewer"
    }
}


# ─── HELPERS ──────────────────────────────────────────────────────────────────
def gen_id():
    return str(uuid.uuid4())


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def fix_doc(doc: dict) -> dict:
    """Convert MongoDB doc: remove _id, ensure string id."""
    if doc is None:
        return {}
    doc.pop("_id", None)
    if "id" not in doc:
        doc["id"] = gen_id()
    return doc


def fix_docs(docs: list) -> list:
    return [fix_doc(d) for d in docs]


async def add_log(source: str, level: str, message: str, details: dict = None):
    """Helper to create a log entry."""
    try:
        await db.logs.insert_one({
            "id": gen_id(),
            "source": source,
            "level": level,
            "message": message,
            "details": details or {},
            "timestamp": now_iso(),
        })
    except Exception:
        pass


async def send_telegram_message(message: str):
    """Envia uma mensagem para o Telegram usando as configurações do banco."""
    try:
        settings = await db.settings.find_one({})
        if not settings:
            return
        
        token = settings.get("telegram_bot_token")
        chat_id = settings.get("telegram_chat_id")
        
        if not token or not chat_id:
            return

        url = f"https://api.telegram.org/bot{token}/sendMessage"
        async with httpx.AsyncClient() as client:
            await client.post(url, json={
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "HTML"
            })
    except Exception as e:
        await add_log("system", "error", f"Falha ao enviar Telegram: {str(e)}")

async def check_inventory_and_notify():
    """Job periódico para verificar estoque baixo e enviar resumo matinal."""
    while True:
        try:
            now = datetime.now()
            settings = await db.settings.find_one({})
            if settings:
                notify_hour = settings.get("notification_hour", 10)
                
                # Só executa se estiver no horário configurado (ex: entre 10:00 e 10:01)
                if now.hour == notify_hour and now.minute == 0:
                    # Aqui você integraria com o Supabase para buscar itens baixos
                    # Como o Supabase é acessado via frontend, o ideal seria o backend 
                    # também ter acesso ou receber os dados.
                    # Por enquanto, enviaremos um lembrete genérico de conferência.
                    msg = "☀️ <b>Bom dia!</b>\n\nNão esqueça de conferir seu inventário hoje. Itens marcados como <b>Críticos</b> precisam de atenção especial!"
                    await send_telegram_message(msg)
                    await asyncio.sleep(61) # Evita repetir no mesmo minuto
            
            await asyncio.sleep(60) # Verifica a cada minuto
        except Exception as e:
            logger.error(f"Erro no job de notificação: {e}")
            await asyncio.sleep(300)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(check_inventory_and_notify())


# ─── MODELS ───────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class MessageCreate(BaseModel):
    content: str


class ConversationCreate(BaseModel):
    title: str = "Nova Conversa"


class AgentCreate(BaseModel):
    name: str
    description: str = ""
    model: str = "astra-default"
    tools: List[str] = []
    status: str = "active"


class LogCreate(BaseModel):
    source: str
    level: str = "info"
    message: str
    details: Dict[str, Any] = {}


class KnowledgeCreate(BaseModel):
    title: str
    content: str
    tags: List[str] = []


class WorkflowCreate(BaseModel):
    name: str
    description: str = ""
    steps: List[Dict[str, str]] = []
    status: str = "draft"


class SettingsUpdate(BaseModel):
    openclaw_url: str = "http://localhost:59062"
    openclaw_port: int = 59062
    openclaw_api_path: str = "/v1/chat/completions"
    astra_model: str = "astra-default"
    astra_system_prompt: str = "Você é Astra, uma IA assistente pessoal avançada e precisa."
    astra_temperature: float = 0.7
    astra_max_tokens: int = 4096
    log_retention_days: int = 30
    messages_per_page: int = 50
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    notification_hour: int = 10


class ConnectionTest(BaseModel):
    url: str


# ─── HEALTH ───────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Astra AI API v1.0", "status": "online"}


# ─── AUTH HELPERS ─────────────────────────────────────────────────────────────
def create_jwt_token(username: str, role: str) -> str:
    """Create JWT token for authenticated user."""
    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str) -> dict:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Token inválido")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency to get current authenticated user."""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    username = payload.get("sub")
    role = payload.get("role")
    
    if not username or username not in USERS_DB:
        raise HTTPException(401, "Usuário não encontrado")
    
    return {"username": username, "role": role}


# ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────
@api_router.post("/auth/login")
async def login(body: LoginRequest):
    """Login endpoint - returns JWT token."""
    user = USERS_DB.get(body.username)
    
    if not user:
        raise HTTPException(401, "Usuário ou senha incorretos")
    
    # Verify password
    if not bcrypt.checkpw(body.password.encode(), user["password_hash"].encode()):
        raise HTTPException(401, "Usuário ou senha incorretos")
    
    # Create token
    token = create_jwt_token(user["username"], user["role"])
    
    return {
        "token": token,
        "user": {
            "username": user["username"],
            "role": user["role"]
        }
    }


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info."""
    return current_user


@api_router.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout endpoint (token invalidation handled client-side)."""
    return {"message": "Logout realizado com sucesso"}


# ─── DASHBOARD ────────────────────────────────────────────────────────────────
@api_router.get("/dashboard/metrics")
async def get_metrics():
    total_conversations = await db.conversations.count_documents({})
    total_agents = await db.agents.count_documents({})
    active_agents = await db.agents.count_documents({"status": "active"})
    total_logs = await db.logs.count_documents({})
    total_knowledge = await db.knowledge.count_documents({})
    total_workflows = await db.workflows.count_documents({})
    return {
        "total_conversations": total_conversations,
        "total_agents": total_agents,
        "active_agents": active_agents,
        "total_logs": total_logs,
        "total_knowledge": total_knowledge,
        "total_workflows": total_workflows,
    }


# ─── CONVERSATIONS ────────────────────────────────────────────────────────────
@api_router.get("/conversations")
async def list_conversations():
    docs = await db.conversations.find({}, {"_id": 0, "messages": 0}).sort("updated_at", -1).to_list(100)
    return fix_docs(docs)


@api_router.post("/conversations")
async def create_conversation(body: ConversationCreate):
    doc = {
        "id": gen_id(),
        "title": body.title,
        "messages": [],
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.conversations.insert_one(doc)
    doc.pop("_id", None)
    await add_log("chat", "info", f"Nova conversa criada: {body.title}")
    return doc


@api_router.get("/conversations/{conv_id}")
async def get_conversation(conv_id: str):
    doc = await db.conversations.find_one({"id": conv_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Conversa não encontrada")
    return doc


@api_router.delete("/conversations/{conv_id}")
async def delete_conversation(conv_id: str):
    result = await db.conversations.delete_one({"id": conv_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Conversa não encontrada")
    return {"message": "Deletada"}


@api_router.post("/conversations/{conv_id}/messages")
async def send_message(conv_id: str, body: MessageCreate):
    conv = await db.conversations.find_one({"id": conv_id}, {"_id": 0})
    if not conv:
        raise HTTPException(404, "Conversa não encontrada")

    # Append user message
    user_msg = {"role": "user", "content": body.content, "timestamp": now_iso()}
    messages = conv.get("messages", [])
    messages.append(user_msg)

    # Get settings for OpenClaw call
    settings_doc = await db.settings.find_one({}, {"_id": 0})
    settings = settings_doc or {}
    openclaw_url = settings.get("openclaw_url", "http://localhost:59062")
    api_path = settings.get("openclaw_api_path", "/v1/chat/completions")
    model = settings.get("astra_model", "astra-default")
    system_prompt = settings.get("astra_system_prompt", "Você é Astra, uma IA assistente pessoal avançada.")
    temperature = settings.get("astra_temperature", 0.7)
    max_tokens = settings.get("astra_max_tokens", 4096)

    # Build messages for OpenClaw
    chat_messages = [{"role": "system", "content": system_prompt}]
    for m in messages[-20:]:  # last 20 messages for context
        chat_messages.append({"role": m["role"], "content": m["content"]})

    # Call OpenClaw
    full_url = f"{openclaw_url.rstrip('/')}{api_path}"
    try:
        async with httpx.AsyncClient(timeout=60.0) as http_client:
            response = await http_client.post(
                full_url,
                json={
                    "model": model,
                    "messages": chat_messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "stream": False,
                },
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            data = response.json()

        # Extract assistant message
        assistant_content = (
            data.get("choices", [{}])[0].get("message", {}).get("content", "")
            or data.get("content", "")
            or data.get("message", "")
            or "Resposta vazia do OpenClaw"
        )
        assistant_msg = {"role": "assistant", "content": assistant_content, "timestamp": now_iso()}
        messages.append(assistant_msg)
        await add_log("chat", "success", f"Resposta recebida para conversa {conv_id[:8]}")

    except httpx.ConnectError:
        raise HTTPException(
            503,
            f"Não foi possível conectar ao OpenClaw em {openclaw_url}. "
            "Verifique se o Gateway está rodando e configure a URL em Settings."
        )
    except httpx.TimeoutException:
        raise HTTPException(504, "OpenClaw demorou demais para responder (timeout 60s)")
    except Exception as e:
        await add_log("chat", "error", f"Erro ao chamar OpenClaw: {str(e)}")
        raise HTTPException(502, f"Erro ao comunicar com OpenClaw: {str(e)}")

    # Update title from first user message if still default
    title = conv.get("title", "Nova Conversa")
    if title == "Nova Conversa" and body.content:
        title = body.content[:50] + ("..." if len(body.content) > 50 else "")

    await db.conversations.update_one(
        {"id": conv_id},
        {"$set": {"messages": messages, "title": title, "updated_at": now_iso()}}
    )

    return {**conv, "messages": messages, "title": title, "updated_at": now_iso()}


# ─── AGENTS ───────────────────────────────────────────────────────────────────
@api_router.get("/agents")
async def list_agents():
    docs = await db.agents.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return fix_docs(docs)


@api_router.post("/agents")
async def create_agent(body: AgentCreate):
    doc = {
        "id": gen_id(),
        **body.model_dump(),
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.agents.insert_one(doc)
    doc.pop("_id", None)
    await add_log("agent", "info", f"Agente criado: {body.name}")
    return doc


@api_router.put("/agents/{agent_id}")
async def update_agent(agent_id: str, body: AgentCreate):
    updates = {**body.model_dump(), "updated_at": now_iso()}
    result = await db.agents.update_one({"id": agent_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(404, "Agente não encontrado")
    doc = await db.agents.find_one({"id": agent_id}, {"_id": 0})
    await add_log("agent", "info", f"Agente atualizado: {body.name}")
    return fix_doc(doc)


@api_router.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    result = await db.agents.delete_one({"id": agent_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Agente não encontrado")
    await add_log("agent", "warning", f"Agente deletado: {agent_id[:8]}")
    return {"message": "Deletado"}


# ─── LOGS ─────────────────────────────────────────────────────────────────────
@api_router.get("/logs")
async def get_logs(
    level: Optional[str] = None,
    source: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=200, le=500),
):
    query = {}
    if level:
        query["level"] = level
    if source:
        query["source"] = source
    if search:
        query["message"] = {"$regex": search, "$options": "i"}

    docs = await db.logs.find(query, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    return {"logs": fix_docs(docs), "total": len(docs)}


@api_router.post("/logs")
async def create_log(body: LogCreate):
    doc = {
        "id": gen_id(),
        **body.model_dump(),
        "timestamp": now_iso(),
    }
    await db.logs.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.delete("/logs")
async def clear_logs():
    result = await db.logs.delete_many({})
    return {"message": f"{result.deleted_count} logs removidos"}


# ─── KNOWLEDGE ────────────────────────────────────────────────────────────────
@api_router.get("/knowledge")
async def list_knowledge():
    docs = await db.knowledge.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return fix_docs(docs)


@api_router.post("/knowledge")
async def create_knowledge(body: KnowledgeCreate):
    doc = {
        "id": gen_id(),
        **body.model_dump(),
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.knowledge.insert_one(doc)
    doc.pop("_id", None)
    await add_log("knowledge", "info", f"Conhecimento adicionado: {body.title}")
    return doc


@api_router.put("/knowledge/{item_id}")
async def update_knowledge(item_id: str, body: KnowledgeCreate):
    updates = {**body.model_dump(), "updated_at": now_iso()}
    result = await db.knowledge.update_one({"id": item_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(404, "Item não encontrado")
    doc = await db.knowledge.find_one({"id": item_id}, {"_id": 0})
    return fix_doc(doc)


@api_router.delete("/knowledge/{item_id}")
async def delete_knowledge(item_id: str):
    result = await db.knowledge.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Item não encontrado")
    return {"message": "Deletado"}


# ─── WORKFLOWS ────────────────────────────────────────────────────────────────
@api_router.get("/workflows")
async def list_workflows():
    docs = await db.workflows.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return fix_docs(docs)


@api_router.post("/workflows")
async def create_workflow(body: WorkflowCreate):
    doc = {
        "id": gen_id(),
        **body.model_dump(),
        "last_run": None,
        "run_count": 0,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.workflows.insert_one(doc)
    doc.pop("_id", None)
    await add_log("workflow", "info", f"Workflow criado: {body.name}")
    return doc


@api_router.put("/workflows/{wf_id}")
async def update_workflow(wf_id: str, body: WorkflowCreate):
    updates = {**body.model_dump(), "updated_at": now_iso()}
    result = await db.workflows.update_one({"id": wf_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(404, "Workflow não encontrado")
    doc = await db.workflows.find_one({"id": wf_id}, {"_id": 0})
    return fix_doc(doc)


@api_router.delete("/workflows/{wf_id}")
async def delete_workflow(wf_id: str):
    result = await db.workflows.delete_one({"id": wf_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Workflow não encontrado")
    return {"message": "Deletado"}


@api_router.post("/workflows/{wf_id}/run")
async def run_workflow(wf_id: str):
    doc = await db.workflows.find_one({"id": wf_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Workflow não encontrado")
    await db.workflows.update_one(
        {"id": wf_id},
        {"$set": {"last_run": now_iso()}, "$inc": {"run_count": 1}}
    )
    await add_log("workflow", "success", f"Workflow executado: {doc.get('name', wf_id[:8])}")
    return {"message": "Workflow executado", "last_run": now_iso()}


# ─── SETTINGS ─────────────────────────────────────────────────────────────────
@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({}, {"_id": 0})
    if not doc:
        # Return defaults
        return SettingsUpdate().model_dump()
    doc.pop("_id", None)
    return doc


@api_router.put("/settings")
async def update_settings(body: SettingsUpdate):
    data = body.model_dump()
    data["updated_at"] = now_iso()
    existing = await db.settings.find_one({})
    if existing:
        await db.settings.update_one({}, {"$set": data})
    else:
        await db.settings.insert_one({"id": gen_id(), **data})
    await add_log("system", "info", "Configurações atualizadas")
    return data


@api_router.post("/settings/test-connection")
async def test_connection(body: ConnectionTest):
    url = body.url.rstrip("/")
    try:
        async with httpx.AsyncClient(timeout=5.0) as http_client:
            # Try a simple request to the OpenClaw gateway
            response = await http_client.get(f"{url}/v1/models")
            if response.status_code in (200, 404, 405):
                return {"success": True, "message": f"Conectado com sucesso ao Gateway em {url}", "status_code": response.status_code}
            return {"success": True, "message": f"Gateway respondeu com status {response.status_code}", "status_code": response.status_code}
    except httpx.ConnectError:
        raise HTTPException(503, f"Não foi possível conectar ao Gateway em {url}. Verifique se o OpenClaw está rodando.")
    except httpx.TimeoutException:
        raise HTTPException(504, f"Timeout ao conectar em {url}")
    except Exception as e:
        raise HTTPException(500, f"Erro: {str(e)}")


# ─── APP SETUP ────────────────────────────────────────────────────────────────
@api_router.post("/telegram/test")
async def test_telegram():
    await send_telegram_message("🧪 <b>Teste de Unificação</b>\n\nConexão com o Gateway Telegram realizada com sucesso!")
    return {"status": "success", "message": "Mensagem de teste enviada"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # Seed a welcome log
    count = await db.logs.count_documents({})
    if count == 0:
        await add_log("system", "success", "Astra AI iniciada com sucesso")
        await add_log("system", "info", "Sistema pronto para receber conexões")


@app.on_event("shutdown")
async def shutdown():
    client.close()
