# Apoia.dev

<p align="center">
  <img src="https://raw.githubusercontent.com/user-attachments/assets/97413a23-b684-486d-9799-a359781878d6" alt="Capa do Projeto Apoia.dev" width="700"/>
</p>

<p align="center">
  <strong>Monetize seu público de forma descomplicada.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Stripe-purple?style=for-the-badge&logo=stripe" alt="Stripe">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma" alt="Prisma">
</p>

**Apoia.dev** é uma aplicação web full-stack que permite a criadores de conteúdo (desenvolvedores, designers, etc.) criar uma página personalizada para receber doações e apoio financeiro de sua audiência. A plataforma é construída com as tecnologias mais modernas do ecossistema JavaScript.

## ✨ Features

*   **👤 Autenticação Social**: Cadastro e login rápidos e seguros utilizando contas do GitHub.
*   **💳 Integração com Stripe Connect**: Onboarding de criadores para contas de pagamento (Stripe Express) de forma simples e segura.
*   **💸 Fluxo de Doação Completo**: Permite que apoiadores façam doações via cartão de crédito, com mensagens personalizadas.
*   **📊 Dashboard do Criador**:
    *   Visualização de estatísticas (total de apoiadores, valor arrecadado, saldo em conta).
    *   Listagem de doações recebidas em tempo real.
    *   Acesso direto ao dashboard da Stripe para gerenciamento financeiro.
*   **📝 Página de Perfil Pública**: Cada criador possui uma URL única (`/creator/username`) para divulgar seu trabalho.
*   **✏️ Gerenciamento de Perfil**: Criadores podem facilmente editar seu nome, bio e criar um nome de usuário único.
*   **⚙️ Webhooks**: Processamento automático de pagamentos e atualização do status das doações.

## 🚀 Arquitetura e Tecnologias

O projeto é construído sobre o **Next.js 15** utilizando o **App Router**, o que permite uma arquitetura moderna baseada em componentes React Server Components (RSC) e Server Actions.

### Principais Tecnologias:

*   **Framework**: Next.js
*   **Linguagem**: TypeScript
*   **Autenticação**: NextAuth.js (Auth.js)
*   **Banco de Dados & ORM**: Prisma com PostgreSQL (ou outro BD suportado)
*   **Pagamentos**: Stripe
*   **Estilização**: Tailwind CSS
*   **Componentes UI**: shadcn/ui (baseado em Radix UI)
*   **Validação de Dados**: Zod
*   **Gerenciamento de Formulários**: React Hook Form
*   **Data Fetching (Client-side)**: TanStack Query (React Query)

### Estrutura de Diretórios

A estrutura do projeto é organizada para promover a co-localização e a separação de responsabilidades:

```
src/
├── app/
│   ├── api/                # API Routes (webhooks, etc.)
│   ├── creator/[username]/ # Página pública do criador
│   │   ├── _actions/       # Server Actions específicas da rota
│   │   └── _components/    # Componentes específicos da rota
│   ├── dashboard/          # Dashboard do criador
│   │   ├── _actions/
│   │   ├── _components/
│   │   └── _data_access/   # Funções de acesso a dados (Server-side)
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página inicial (Landing Page)
├── components/
│   └── ui/                 # Componentes de UI reutilizáveis (shadcn)
├── lib/                    # Configurações centrais (Prisma, Auth, Stripe)
├── providers/              # Provedores de contexto (React Query, NextAuth)
└── utils/                  # Funções utilitárias
```

## 🏁 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   Node.js (versão 20.x ou superior)
*   pnpm (ou npm/yarn)
*   Uma conta Stripe
*   Stripe CLI para testar webhooks localmente

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/apoia-dev.git
cd apoia-dev
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` (se houver, caso contrário crie um `.env`) e preencha as variáveis:

```bash
# .env

# Prisma
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth.js
AUTH_SECRET="gere_uma_secret_com_openssl_rand_hex_32"
AUTH_GITHUB_ID="seu_github_oauth_id"
AUTH_GITHUB_SECRET="seu_github_oauth_secret"

# Stripe
STRIPE_SECRET_KEY="sua_sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="sua_pk_test_..."
STRIPE_WEBHOOK_SECRET="seu_whsec_..._gerado_pela_stripe_cli"

# App
NEXT_PUBLIC_HOST_URL="http://localhost:3000"
```

### 4. Configurar o Banco de Dados

Execute as migrações do Prisma para criar as tabelas no seu banco de dados.

```bash
pnpm prisma migrate dev
```

### 5. Iniciar a Aplicação

Inicie o servidor de desenvolvimento do Next.js.

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

### 6. Configurar o Webhook da Stripe

Para que a aplicação receba eventos de pagamento da Stripe (como a confirmação de uma doação), você precisa encaminhar os eventos para sua máquina local.

Em um novo terminal, execute o comando da Stripe CLI (conforme definido no `package.json`):

```bash
pnpm stripe:listen
```

Este comando irá ouvir os eventos da Stripe e encaminhá-los para o endpoint `/api/stripe/webhook`. A CLI fornecerá um segredo de webhook (`whsec_...`) que você deve colocar na variável `STRIPE_WEBHOOK_SECRET` no seu arquivo `.env`.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

_Desenvolvido com ❤️ por [Luis Felipe de Paula Costa](https://github.com/LuPeBreak)._