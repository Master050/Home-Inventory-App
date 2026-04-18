# 🏠 Home Inventory v2.7.0 - Sistema de Gestão Doméstica Proativa

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
- **Unidades Adaptáveis**: Unidades (kg, L, un, etc.), Local de Armazenamento e Importância (Crítico/Desejável)

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

### v2.7.0 (Atual)
- **Layout Adaptativo Total**: Remoção da restrição de 1600px; a tabela agora se expande para ocupar **98% da tela** em qualquer monitor.
- **Interface Simplificada**: Remoção completa da coluna e funcionalidade de **Macros (P/G/C)** para maior foco no essencial.
- **Fix de Renderização**: Correção do erro que causava tela preta na página de **Desperdício** (WasteLog).
- **Consolidação de Docs**: Unificação do changelog no README e remoção de arquivos duplicados.

### v2.6.6 (Agora)
- **Equilíbrio Proporcional**: Redistribuição inteligente de colunas para eliminar o "vácuo" central em monitores ultra-wide.
- **Proteção de Texto**: Aumento das colunas de Categoria e Status para evitar nomes cortados.
- **Setas de Seleção**: Adicionado padding interno nos seletores para que a seta não sobreponha o texto.
- **Limite de Stretched**: Adicionada largura máxima de 1600px ao container para manter a densidade visual premium.

### v2.6.5
- **Grade Rígida**: Reconstrução completa da tabela com alinhamento milimétrico entre cabeçalho, corpo e rodapé.
- **Sincronia Global**: Atualização da etiqueta de versão na barra lateral e documentação.

### v2.6.4
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
**Versão:** 2.7.0  
**Ano:** 2026

---

**Status:** 🟢 PRODUÇÃO  
**Última Atualização:** 18 de Abril de 2026 (v2.7.0)
