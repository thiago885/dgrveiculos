# DGR Veículos — Elite em Seminovos

Site de revenda de veículos seminovos de alto padrão, com painel administrativo completo.

## Stack

- **Next.js 15** (App Router, SSR)
- **Tailwind CSS** + **Shadcn UI**
- **Framer Motion** (`motion` package)
- **Supabase** — Banco de dados, Auth e Storage
- **Anthropic Claude API** — Geração de descrições com IA
- **Lucide React**

## Configuração

### 1. Variáveis de ambiente

Renomeie `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Banco de dados Supabase

Execute `supabase/schema.sql` no **SQL Editor** do seu projeto Supabase.

Cria: tabela `vehicles` com RLS + bucket `vehicles` no Storage.

### 3. Criar usuário admin

Supabase → **Authentication → Users → Add user**.

### 4. Rodar

```bash
npm install
npm run dev
```

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
