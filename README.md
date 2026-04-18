# 🏠 Home Inventory v2.6.4 - Sistema de Gestão Doméstica Proativa

## 🎉 Bem-vindo ao seu sistema de inventário inteligente!

Sistema completo de gerenciamento de estoque doméstico com visual futurista, animações suaves e experiência premium. Agora com foco em gestão proativa e saúde nutricional.

---

## 🚀 Início Rápido

### Login:
- **ADMIN**: Digite senha `223344` (acesso completo)
- **Mãe**: Click automático (visualização)
- **Pai**: Click automático (visualização)

### URL:
[https://Master050.github.io/Home-Inventory-App/](https://Master050.github.io/Home-Inventory-App/)

---

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- 3 níveis de usuário (Admin, Mãe, Pai)
- JWT tokens seguros
- Sessões persistentes
- Proteção de rotas

### 📦 Gestão de Inventário
- Adicionar/editar/deletar itens (Admin)
- Categorias coloridas (incluindo **Carnes**)
- Barras de progresso por item
- **Novos Campos**: Unidades (kg, L, un, etc.), Local de Armazenamento e Importância (Crítico/Desejável)
- **Rastreamento de Macros**: Proteína, Gordura e Carboidrato por item

### 🗑️ Log de Desperdícios
- Página dedicada para registro de perdas e itens vencidos
- **Ação Rápida**: Registro direto da tabela de estoque

### 📊 Dashboard Inteligente
- **Perfil Nutricional**: Resumo total de macronutrientes do estoque
- Relógio em tempo real
- 4 cards de estatísticas e distribuição por categoria
- Lista de ações urgentes e auto-refresh

### 🤖 Integração Telegram
- **Notificações Proativas**: Alertas de estoque baixo e resumo matinal
- Gateway configurável via painel de Settings

---

## 🎨 Destaques Visuais

### Animações:
- ✨ Transições suaves entre páginas
- 📊 Barras de progresso animadas
- 🌊 Efeitos de scanning
- 💫 Hover com glow neon
- 🎆 Particles ao clicar

### Efeitos Especiais:
- 🖱️ **Cursor Follower** (Desktop) - Luzinha que segue o mouse
- 🎬 **Matrix Rain** (Easter Egg) - Triplo-click no logo
- 💡 **Scan Lines** - Efeito futurista nos cards
- ⚡ **Ripple Effect** - Ondas ao clicar botões

---

## ⚙️ Configurações
- **Gateway Telegram**: Configuração de Bot Token e Chat ID
- Perfil do usuário e permissões
- Tema Dark/Light e Idioma
- Export/Import e Auto-backup

---

## 📱 Responsividade

### Desktop (> 1024px):
- Layout completo e Cursor follower ativo

### Mobile (< 640px):
- Gestos touch e touch-friendly (48px mínimo)
- Cards empilhados e tabelas otimizadas

---

## 🔑 Permissões

### ADMIN:
- ✅ CRUD completo de inventário e desperdícios
- ✅ Acesso a configurações de Gateway
- ✅ Backup e limpeza do sistema

### Mãe/Pai (Viewers):
- ✅ Visualizar tudo e acessar dashboard
- ❌ Editar/Deletar (inputs bloqueados)

---

## 🚀 Stack Tecnológica

### Frontend:
- React 19, TailwindCSS, Framer Motion, Recharts, Radix UI

### Backend:
- FastAPI, MongoDB (Motor), JWT Auth, Bcrypt

### Database:
- Supabase (PostgreSQL)

---

## 📝 Changelog Recente (2026)

### v2.6.4 (Agora)
- **Layout Milimétrico**: Refatoração total da tabela de inventário para proporcionalidade flexível. O nome do produto agora ganha o máximo de espaço dinâmico.
- **Sincronia de Bordas**: O rodapé foi reconstruído matematicamente para alinhar suas linhas verticais perfeitamente com as colunas superiores.
- **Proteção Visual**: Corrigida a sobreposição de efeitos do tema em cima dos textos das colunas.

### v2.6.3
- **UI Proporcional**: Ajustado o equilíbrio das colunas no inventário (Produto ganhou mais espaço, Unidade e Categoria ficaram mais compactos).
- **Correção de Texto**: Nomes de produtos longos não são mais truncados agressivamente.
- **Redocumentação**: Limpeza de duplicatas no manual técnico (README).

### v2.6.2 (Recente)
- **Correção de UI**: Corrigido o alinhamento do rodapé do Inventário (Custo de Reposição) que não cobria as colunas de Macros e Ações.
- **Limpeza**: Removido o espaço vazio à direita no resumo financeiro da tabela.

### v2.6.1
- **Correção de UI**: Ajustado o alinhamento de colunas no Inventário (Atual/Ideal/Status) que estava trocado.
- **UX**: Adicionado painel de "Manual de Operação" no Dashboard para facilitar o entendimento das novas métricas.

---

## 🏆 Créditos

**Desenvolvido por:** Master050  
**Licença:** Privada  
**Versão:** 2.6.3  
**Ano:** 2026

---

**Status:** 🟢 PRODUÇÃO  
**Última Atualização:** 18 de Abril de 2026 (v2.6.3)
