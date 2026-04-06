# Digital Touch — Frontend

Plataforma de gestão com IA. Interface web construída com Next.js 16 (App Router), React 19 e Tailwind CSS.

## Stack

- **Next.js 16** — App Router, Route Groups, Proxy (middleware)
- **React 19** — com TanStack Query para gerenciamento de estado assíncrono
- **Tailwind CSS v4** + **shadcn/ui** — componentes e estilização
- **Axios** — cliente HTTP com interceptors para refresh automático de token
- **TypeScript**

## Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:8080`

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> As chamadas para `/api/*` são reescritas pelo Next.js e encaminhadas ao backend em `localhost:8080`.

## Rodando o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura

```
src/
├── app/
│   ├── (app)/          # Rotas protegidas (dashboard, chat, tasks, admin)
│   ├── (auth)/         # Rotas públicas (login)
│   └── layout.tsx      # Layout raiz com providers
├── components/
│   ├── layout/         # Sidebar, Header
│   ├── shared/         # Componentes reutilizáveis (LoadingSpinner, ErrorMessage)
│   └── ui/             # Componentes shadcn/ui
├── contexts/           # AuthContext, QueryProvider
├── hooks/              # Custom hooks
├── lib/                # Axios instance, token store
├── proxy.ts            # Middleware Next.js 16
└── types/              # Tipos TypeScript globais
```

## Autenticação

O fluxo usa JWT com refresh token HttpOnly:

1. Login via `POST /auth/login` → recebe `accessToken` (memória) + cookie `refresh_token`
2. O `AuthContext` tenta restaurar a sessão via `POST /auth/refresh` ao montar
3. Rotas protegidas são guardadas client-side pelo layout de `(app)/`
4. O Axios intercepta respostas `401` e faz refresh automático do token
