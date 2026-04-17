# Astra AI - PRD (Product Requirements Document)

**Data de criação:** Fevereiro 2026  
**Status:** MVP Completo

---

## Descrição do Produto

Site completo para a IA pessoal "Astra" - uma interface administrativa avançada para gerenciar e interagir com a Astra AI via OpenClaw Gateway local.

---

## Arquitetura

- **Frontend:** React 19 + Tailwind CSS + Framer Motion
- **Backend:** FastAPI + MongoDB
- **Integração:** OpenClaw Gateway (configurável via Settings)
- **Design:** Dark theme glassmorphism, cores roxo/ciano/azul, fontes Rajdhani + Plus Jakarta Sans

---

## Páginas Implementadas

| Página | Rota | Status |
|--------|------|--------|
| Dashboard | `/dashboard` | ✅ Completo |
| Chat | `/chat/:id` | ✅ Completo |
| Agents | `/agents` | ✅ Completo |
| Logs | `/logs` | ✅ Completo |
| Knowledge Base | `/knowledge` | ✅ Completo |
| Workflows | `/workflows` | ✅ Completo |
| Settings | `/settings` | ✅ Completo |

---

## O que foi implementado (v3 - AI Command Center - Fev 2026)
- Dashboard totalmente redesenhado: header "ASTRA AI CMD CENTER" com relógio em tempo real + status ONLINE/OFFLINE
- Typewriter animation no greeting: texto aparece letra a letra
- Count-up animation nos números das métricas (contam do 0 até o valor)
- Signal bars animadas abaixo de cada métrica
- Scan line sweeping nas stat cards
- Anel duplo rotatório no logo (ring-rotate + ring-rotate-reverse)
- Gráfico "PULSO NEURAL" com tokens/eventos 12h + SVG glow filter
- Painel "STATUS SISTEMA" com barras de progresso animadas (4 métricas)
- Feed "FEED NEURAL" em estilo terminal (monospace, ícones de estado)
- Morse pulse dots no header do feed
- Cursor piscando no typewriter
- Stagger entrance nos itens do sidebar (aparecem escalonados)
- CSS animations: scan-sweep, pulse-ring, bar-grow, progress-fill, cursor-blink, number-appear, breathe-glow, ring-rotate, stagger-in, float-label, morse-pulse
- AstraBackground.jsx: 35 partículas animadas flutuantes + 5 orbs de gradiente + 3 light streaks + dot grid
- Sidebar: Logo CSS com gradiente azul/roxo/ciano + glow pulsante animado + aurora line + active state com glow
- Dashboard: Títulos com gradient text branco→azul→roxo→ciano + números com neon glow + inner glow nos cards
- Todos os page titles com gradient animado consistente
- Glassmorphism melhorado: backdrop-blur maior, shadows multicamadas
- Chat: Logo da Astra com anel giratório gradiente animado

### Frontend
- Sidebar colapsável com navegação completa
- Dashboard com métricas em tempo real e gráficos
- Chat com histórico de conversas e proxy para OpenClaw
- CRUD completo para Agents (com ferramentas, modelos, status)
- Sistema de Logs com filtros por nível/fonte e busca
- Knowledge Base com tags e busca full-text
- Workflows com passos configuráveis e execução
- Settings com config OpenClaw, personalidade Astra, parâmetros do modelo

### Backend (FastAPI)
- `GET/POST /api/conversations` - Gerenciamento de conversas
- `GET/POST /api/conversations/{id}/messages` - Chat com proxy OpenClaw
- `GET/POST/PUT/DELETE /api/agents` - CRUD de agentes
- `GET/POST/DELETE /api/logs` - Sistema de logs
- `GET/POST/PUT/DELETE /api/knowledge` - Base de conhecimento
- `GET/POST/PUT/DELETE /api/workflows` - Workflows
- `POST /api/workflows/{id}/run` - Executar workflow
- `GET/PUT /api/settings` - Configurações
- `POST /api/settings/test-connection` - Testar conexão OpenClaw
- `GET /api/dashboard/metrics` - Métricas do dashboard

---

## Integração OpenClaw

O chat usa proxy via backend para chamar o OpenClaw Gateway local.

**Para funcionar:**
1. OpenClaw deve estar rodando em `localhost:59062`
2. Configurar URL em Settings → OpenClaw Gateway
3. Para acesso remoto: usar ngrok (`ngrok http 59062`) e configurar a URL gerada

---

## Backlog P0/P1/P2

### P0 (Próxima sessão)
- Configuração de autenticação (JWT ou Google OAuth)
- Streaming de respostas no chat (SSE)

### P1
- Tela de visualização de agentes do OpenClaw em tempo real
- Importar/exportar Knowledge Base
- Notificações push para workflows concluídos

### P2
- Dashboard com WebSocket para updates em tempo real
- Multi-usuário com permissões
- API key management
- Histórico de execuções de workflows com logs detalhados
- Integração com Telegram/Discord para notificações

---

## Design System

- **Cor primária:** `#a855f7` (roxo)
- **Cor secundária:** `#22d3ee` (ciano)
- **Acento:** `#4fc3f7` (azul)
- **Background:** `#050508`
- **Fonte heading:** Rajdhani (500/600/700)
- **Fonte body:** Plus Jakarta Sans (400/500)
- **Fonte mono:** JetBrains Mono (400)
