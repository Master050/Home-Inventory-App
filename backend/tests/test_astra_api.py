"""Backend API tests for Astra AI - Dashboard, Chat, Agents, Logs, Knowledge, Workflows, Settings"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


# ─── HEALTH ───────────────────────────────────────────────────────────────────
class TestHealth:
    def test_root(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("status") == "online"


# ─── DASHBOARD ────────────────────────────────────────────────────────────────
class TestDashboard:
    def test_metrics(self):
        r = requests.get(f"{BASE_URL}/api/dashboard/metrics")
        assert r.status_code == 200
        data = r.json()
        for key in ["total_conversations", "total_agents", "active_agents", "total_logs", "total_knowledge", "total_workflows"]:
            assert key in data, f"Missing key: {key}"
            assert isinstance(data[key], int)


# ─── CONVERSATIONS ────────────────────────────────────────────────────────────
class TestConversations:
    conv_id = None

    def test_create_conversation(self):
        r = requests.post(f"{BASE_URL}/api/conversations", json={"title": "TEST_Conversa"})
        assert r.status_code == 200
        data = r.json()
        assert data["title"] == "TEST_Conversa"
        assert "id" in data
        TestConversations.conv_id = data["id"]

    def test_list_conversations(self):
        r = requests.get(f"{BASE_URL}/api/conversations")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_get_conversation(self):
        assert TestConversations.conv_id
        r = requests.get(f"{BASE_URL}/api/conversations/{TestConversations.conv_id}")
        assert r.status_code == 200
        assert r.json()["id"] == TestConversations.conv_id

    def test_send_message_503_expected(self):
        """Sending a message should return 503 because OpenClaw isn't running"""
        assert TestConversations.conv_id
        r = requests.post(f"{BASE_URL}/api/conversations/{TestConversations.conv_id}/messages",
                          json={"content": "Hello Astra"})
        assert r.status_code in [503, 504, 502], f"Expected connection error, got {r.status_code}: {r.text}"

    def test_delete_conversation(self):
        assert TestConversations.conv_id
        r = requests.delete(f"{BASE_URL}/api/conversations/{TestConversations.conv_id}")
        assert r.status_code == 200
        # Verify deletion
        r2 = requests.get(f"{BASE_URL}/api/conversations/{TestConversations.conv_id}")
        assert r2.status_code == 404


# ─── AGENTS ───────────────────────────────────────────────────────────────────
class TestAgents:
    agent_id = None

    def test_create_agent(self):
        r = requests.post(f"{BASE_URL}/api/agents", json={
            "name": "TEST_Agent",
            "description": "Test agent",
            "model": "astra-default",
            "tools": ["search"],
            "status": "active"
        })
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Agent"
        TestAgents.agent_id = data["id"]

    def test_list_agents(self):
        r = requests.get(f"{BASE_URL}/api/agents")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_update_agent(self):
        assert TestAgents.agent_id
        r = requests.put(f"{BASE_URL}/api/agents/{TestAgents.agent_id}", json={
            "name": "TEST_Agent_Updated",
            "description": "Updated",
            "model": "astra-default",
            "tools": [],
            "status": "inactive"
        })
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_Agent_Updated"
        assert r.json()["status"] == "inactive"

    def test_delete_agent(self):
        assert TestAgents.agent_id
        r = requests.delete(f"{BASE_URL}/api/agents/{TestAgents.agent_id}")
        assert r.status_code == 200
        r2 = requests.get(f"{BASE_URL}/api/agents")
        ids = [a["id"] for a in r2.json()]
        assert TestAgents.agent_id not in ids


# ─── LOGS ─────────────────────────────────────────────────────────────────────
class TestLogs:
    def test_list_logs(self):
        r = requests.get(f"{BASE_URL}/api/logs")
        assert r.status_code == 200
        data = r.json()
        assert "logs" in data
        assert "total" in data

    def test_create_log(self):
        r = requests.post(f"{BASE_URL}/api/logs", json={
            "source": "test",
            "level": "info",
            "message": "TEST_log_entry"
        })
        assert r.status_code == 200
        assert r.json()["message"] == "TEST_log_entry"

    def test_filter_logs_by_level(self):
        r = requests.get(f"{BASE_URL}/api/logs?level=info")
        assert r.status_code == 200
        for log in r.json()["logs"]:
            assert log["level"] == "info"

    def test_search_logs(self):
        r = requests.get(f"{BASE_URL}/api/logs?search=TEST_log_entry")
        assert r.status_code == 200
        logs = r.json()["logs"]
        assert any("TEST_log_entry" in l["message"] for l in logs)


# ─── KNOWLEDGE ────────────────────────────────────────────────────────────────
class TestKnowledge:
    item_id = None

    def test_create_knowledge(self):
        r = requests.post(f"{BASE_URL}/api/knowledge", json={
            "title": "TEST_Knowledge",
            "content": "Test content here",
            "tags": ["test", "demo"]
        })
        assert r.status_code == 200
        data = r.json()
        assert data["title"] == "TEST_Knowledge"
        TestKnowledge.item_id = data["id"]

    def test_list_knowledge(self):
        r = requests.get(f"{BASE_URL}/api/knowledge")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_update_knowledge(self):
        assert TestKnowledge.item_id
        r = requests.put(f"{BASE_URL}/api/knowledge/{TestKnowledge.item_id}", json={
            "title": "TEST_Knowledge_Updated",
            "content": "Updated content",
            "tags": ["updated"]
        })
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Knowledge_Updated"

    def test_delete_knowledge(self):
        assert TestKnowledge.item_id
        r = requests.delete(f"{BASE_URL}/api/knowledge/{TestKnowledge.item_id}")
        assert r.status_code == 200


# ─── WORKFLOWS ────────────────────────────────────────────────────────────────
class TestWorkflows:
    wf_id = None

    def test_create_workflow(self):
        r = requests.post(f"{BASE_URL}/api/workflows", json={
            "name": "TEST_Workflow",
            "description": "Test workflow",
            "steps": [{"action": "fetch", "target": "url"}],
            "status": "draft"
        })
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Workflow"
        TestWorkflows.wf_id = data["id"]

    def test_list_workflows(self):
        r = requests.get(f"{BASE_URL}/api/workflows")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_run_workflow(self):
        assert TestWorkflows.wf_id
        r = requests.post(f"{BASE_URL}/api/workflows/{TestWorkflows.wf_id}/run")
        assert r.status_code == 200
        assert "last_run" in r.json()

    def test_update_workflow(self):
        assert TestWorkflows.wf_id
        r = requests.put(f"{BASE_URL}/api/workflows/{TestWorkflows.wf_id}", json={
            "name": "TEST_Workflow_Updated",
            "description": "Updated",
            "steps": [],
            "status": "active"
        })
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_Workflow_Updated"

    def test_delete_workflow(self):
        assert TestWorkflows.wf_id
        r = requests.delete(f"{BASE_URL}/api/workflows/{TestWorkflows.wf_id}")
        assert r.status_code == 200


# ─── SETTINGS ─────────────────────────────────────────────────────────────────
class TestSettings:
    def test_get_settings(self):
        r = requests.get(f"{BASE_URL}/api/settings")
        assert r.status_code == 200
        data = r.json()
        assert "openclaw_url" in data
        assert "astra_temperature" in data

    def test_update_settings(self):
        r = requests.put(f"{BASE_URL}/api/settings", json={
            "openclaw_url": "http://localhost:59062",
            "openclaw_port": 59062,
            "openclaw_api_path": "/v1/chat/completions",
            "astra_model": "astra-default",
            "astra_system_prompt": "Test prompt",
            "astra_temperature": 0.8,
            "astra_max_tokens": 2048,
            "log_retention_days": 30,
            "messages_per_page": 50
        })
        assert r.status_code == 200
        assert r.json()["astra_temperature"] == 0.8

    def test_connection_test_503_expected(self):
        """Test connection to localhost - expected to fail with 503"""
        r = requests.post(f"{BASE_URL}/api/settings/test-connection",
                          json={"url": "http://localhost:59062"})
        assert r.status_code in [503, 504, 500], f"Expected error, got {r.status_code}"
