# 🏠 Home Inventory v2.5.0 - Sistema de Gestão Doméstica

## 🎉 Bem-vindo ao seu sistema de inventário inteligente!

Sistema completo de gerenciamento de estoque doméstico com visual futurista, animações suaves e experiência premium.

---

## 🚀 Início Rápido

### Login:
- **ADMIN**: Digite senha `223344` (acesso completo)
- **Mãe**: Click automático (visualização)
- **Pai**: Click automático (visualização)

### URL:
Acesse através do link de produção (GitHub Pages).

---

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- 3 níveis de usuário (Admin, Mãe, Pai)
- JWT tokens seguros
- Sessões persistentes
- Proteção de rotas

### 📦 Gestão de Inventário
- Adicionar/editar/deletar itens (Admin)
- Categorias coloridas
- Barras de progresso por item
- Cálculo automático de totais
- Indicadores visuais de estoque baixo

### 📊 Dashboard Inteligente
- Relógio em tempo real
- 4 cards de estatísticas
- Distribuição por categoria (cards coloridos)
- Lista de ações urgentes
- Auto-refresh a cada 30s

### ⚙️ Configurações
- Perfil do usuário
- Tema Dark/Light
- Idioma (PT-BR, EN-US, ES-ES)
- Export/Import de dados
- Auto-backup

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

### Cores Temáticas:
- 🟣 Roxo: Primário
- 🔵 Ciano: Secundário
- 🟢 Verde: Sucesso
- 🔴 Vermelho: Alerta
- 🟠 Âmbar: Aviso

---

## 📱 Responsividade

### Desktop (> 1024px):
- Layout completo
- Sidebar lateral
- Cursor follower ativo
- Todos os efeitos visuais

### Tablet (640-1024px):
- Layout adaptado
- Sidebar colapsável
- Cards reorganizados

### Mobile (< 640px):
- Layout otimizado
- Touch-friendly (48px mínimo)
- Cards empilhados 2x2
- Tabelas com scroll horizontal

---

## 🎯 Como Usar

### Inventory:
1. **Visualizar**: Veja todos os itens com status
2. **Adicionar** (Admin): Click em "Nova Linha"
3. **Editar** (Admin): Click em qualquer campo
4. **Salvar** (Admin): Click em "Salvar"
5. **Deletar** (Admin): Click no ícone lixeira

### Dashboard:
1. Monitore estatísticas em tempo real
2. Veja distribuição por categoria
3. Check ações urgentes (itens em falta)
4. Click nos cards para ir ao inventory

### Settings:
1. Ajuste preferências visuais
2. Configure notificações
3. Export/Import dados
4. Veja info do sistema

---

## 🔑 Permissões

### ADMIN:
- ✅ Visualizar tudo
- ✅ Adicionar itens
- ✅ Editar itens
- ✅ Deletar itens
- ✅ Salvar alterações
- ✅ Limpar banco

### Mãe/Pai (Viewers):
- ✅ Visualizar tudo
- ✅ Ver estatísticas
- ✅ Acessar dashboard
- ❌ Editar (inputs bloqueados)
- ❌ Deletar itens

---

## 🎮 Easter Eggs

### Matrix Rain:
1. Vá para qualquer página
2. Dê **triplo-click** no logo (sidebar)
3. Aprecie o efeito Matrix!
4. Click em qualquer lugar para sair

---

## 🐛 Correções Recentes (v2.5.0)

✅ **Health Bar** - Shine contido na cor  
✅ **Footer Inventory** - Sem espaços vazios  
✅ **Gráfico** - Cards coloridos ao invés de barras  
✅ **Login ADMIN** - Senha obrigatória  
✅ **Cursor Follower** - Luzinha seguindo mouse  
✅ **Mobile** - CSS otimizado  

---

## 🚀 Stack Tecnológica

### Frontend:
- React 19
- TailwindCSS
- Framer Motion
- Recharts
- Radix UI
- Sonner (toasts)

### Backend:
- FastAPI
- MongoDB (Motor)
- JWT Auth
- Bcrypt

### Database:
- Supabase (PostgreSQL)

---

## 📊 Estatísticas do Projeto

- **Componentes**: 15+
- **Páginas**: 4 principais
- **Animações**: 50+
- **Linhas de CSS**: 800+
- **Efeitos Visuais**: 20+

---

## 💡 Dicas Pro

### Produtividade:
1. Use quick access no login
2. Click nos cards do dashboard
3. Atalho Ctrl+F para buscar
4. Sidebar compacta (toggle)

### Visual:
1. Passe mouse nos cards (hover effects)
2. Explore todos os tooltips
3. Veja as animações de loading
4. Teste o cursor follower

### Mobile:
1. Scroll horizontal nas tabelas
2. Touch feedback nos botões
3. Landscape mode otimizado

---

## 🔮 Próximas Features (Roadmap)

- [ ] PWA (Progressive Web App)
- [ ] Modo Offline
- [ ] Notificações Push
- [ ] Histórico de Mudanças
- [ ] Gráficos de Consumo
- [ ] Multi-idioma completo
- [ ] Theme Builder
- [ ] Widgets personalizáveis

---

## 📞 Suporte

### Problemas Comuns:

**"Não consigo editar"**
- Você está logado como ADMIN?
- Veja se há ícone de cadeado

**"Login não funciona"**
- ADMIN exige digitar senha
- Mãe/Pai são automáticos
- Verifique credenciais

**"Mobile está diferente"**
- É otimizado para mobile
- Todas funcionalidades presentes
- Layout adaptado para tela menor

---

## 🎨 Customização

### Cores (TailwindCSS):
```css
purple-500: #a855f7
cyan-500: #22d3ee
emerald-500: #10b981
```

### Fontes:
```css
Heading: Rajdhani
Body: Plus Jakarta Sans
Mono: JetBrains Mono
```

---

## 📝 Changelog Granular (2026)

### v2.5.0 (Hoje)
- **UX Mobile**: Implementação de overlay animado ao abrir sidebar e ícone de Menu (Hamburguer).
- **Consistência**: Versão oficial 2.5.0 sincronizada em todo o sistema.

### v2.4.0 (Hoje)
- **Fix Mobile**: Correção de posicionamento da Sidebar (`left-0`) para evitar desaparecimento em telas pequenas.

### v2.3.0 (Hoje)
- **Labels Financeiros**: Renomeado "Estoque" para "Valor em Estoque" e "Reposição" para "Custo de Reposição".

### v2.2.0 (Hoje)
- **Métrica Unificada**: Sincronização da saúde global do Dashboard com a média aritmética do Inventário (max 100% por item).

### v2.1.0 (Ontem)
- **Dashboard UI**: Refinamento de escala visual e cards de categoria coloridos.
- **Lógica Progressiva**: Ajuste para que barras de progresso cheguem a 100% sem transbordar excessos.

### v2.0.0 (Ontem)
- **Redesign Completo**: Nova interface Astra AI-inspired (Glassmorphism, Neon glows).
- **Sistema de Autenticação**: Login com JWT e permissões de Admin/Viewer.
- **Funcionalidades V2**: Dashboard interativo e Settings.

### v1.0.0 (Abril 2026)
- Versão inicial com CRUD básico e integração Supabase.

---

## 🏆 Créditos

**Desenvolvido por:** Master050  
**Design:** Astra Theme  
**Versão:** 2.5.0  
**Licença:** Privada  
**Ano:** 2024-2025

---

## 🌟 Aproveite!

Explore todas as funcionalidades, descubra os easter eggs e aproveite a experiência visual única! 

**Dica Final:** Teste em diferentes dispositivos para ver todas as adaptações responsivas!

---

**Status:** 🟢 PRODUÇÃO  
**Última Atualização:** 17 de Abril de 2026 (v2.5.0)
