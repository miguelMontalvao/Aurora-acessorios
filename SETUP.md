# 🛍️ Aurora Acessórios — Guia de Configuração (Supabase)

Este guia te leva passo a passo para configurar o banco de dados que faz o
painel `/admin` funcionar para **todo mundo que visitar o site**.

Tempo estimado: **10–15 minutos**. Não precisa saber programar.

---

## 📋 Sumário

1. [Criar conta no Supabase](#1-criar-conta-no-supabase)
2. [Criar o projeto](#2-criar-o-projeto)
3. [Criar a tabela de produtos](#3-criar-a-tabela-de-produtos)
4. [Criar o espaço de fotos (Storage)](#4-criar-o-espaço-de-fotos-storage)
5. [Pegar as chaves de acesso](#5-pegar-as-chaves-de-acesso)
6. [Configurar o projeto](#6-configurar-o-projeto)
7. [Testar localmente](#7-testar-localmente)
8. [Publicar no Vercel](#8-publicar-no-vercel)
9. [Trocar a senha do admin](#9-trocar-a-senha-do-admin)

---

## 1. Criar conta no Supabase

1. Acesse **https://supabase.com**
2. Clique em **"Start your project"**
3. Entre com sua conta do **GitHub** ou **Google** (mais rápido) ou crie com e-mail
4. É **gratuito** — não precisa cartão de crédito

---

## 2. Criar o projeto

1. No painel do Supabase, clique em **"New Project"**
2. Preencha:
   - **Name:** `aurora-acessorios`
   - **Database Password:** crie uma senha forte e **guarde em local seguro**
     (você não vai precisar dela no dia a dia, mas é bom ter salva)
   - **Region:** escolha **South America (São Paulo)** para mais velocidade
3. Clique em **"Create new project"**
4. Aguarde 1-2 minutos enquanto o Supabase prepara tudo

---

## 3. Criar a tabela de produtos

1. No menu lateral esquerdo, clique no ícone **"SQL Editor"** (parece `</>`)
2. Clique em **"New query"**
3. Abra o arquivo **`supabase/setup.sql`** (está dentro da pasta do projeto)
4. **Copie todo o conteúdo** desse arquivo
5. **Cole** na caixa de texto do SQL Editor
6. Clique no botão verde **"Run"** (ou aperte `Ctrl + Enter`)
7. Deve aparecer **"Success. No rows returned"** — tudo certo! ✓

> Isso cria a tabela `products` já com os 14 produtos de exemplo do catálogo.

---

## 4. Criar o espaço de fotos (Storage)

1. No menu lateral, clique em **"Storage"**
2. Clique em **"New bucket"**
3. Nome do bucket: `product-images` *(exatamente assim, em inglês)*
4. Marque a opção **"Public bucket"** ✅ — isso é importante!
   (sem isso, as fotos não aparecem no site)
5. Clique em **"Create bucket"**

---

## 5. Pegar as chaves de acesso

1. No menu lateral, clique no ícone de engrenagem **"Project Settings"**
2. Clique em **"API"**
3. Você vai precisar de dois valores nessa página:

   | O que copiar | Onde está |
   |---|---|
   | **Project URL** | Campo "Project URL" (algo como `https://xxxxx.supabase.co`) |
   | **anon public key** | Em "Project API keys" → chave chamada `anon` `public` |

   📌 Deixe essa aba aberta — você vai usar esses dois valores no próximo passo.

---

## 6. Configurar o projeto

1. Na pasta do projeto, encontre o arquivo **`.env.example`**
2. Faça uma **cópia** dele e renomeie para **`.env`** (sem nada depois do ponto)
3. Abra o arquivo `.env` e cole os valores que você copiou:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_PASSWORD=aurora2026
```

4. Salve o arquivo

> ⚠️ O arquivo `.env` é **privado** — ele nunca vai para o GitHub
> (já está configurado no `.gitignore`). Cada pessoa que rodar o
> projeto precisa criar o seu próprio `.env`.

---

## 7. Testar localmente

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Abra **http://localhost:5173** — o catálogo deve carregar os produtos.

Abra **http://localhost:5173/admin** e digite a senha
(`aurora2026` por padrão, ou a que você colocou no `.env`).

✅ Tente cadastrar um produto de teste. Se ele aparecer no catálogo
   automaticamente — está tudo funcionando!

---

## 8. Publicar no Vercel

1. Suba o projeto para um repositório no **GitHub** (sem o arquivo `.env`!)
2. Acesse **https://vercel.com** e faça login com GitHub
3. Clique em **"Add New" → "Project"**
4. Selecione o repositório `aurora-acessorios`
5. Antes de clicar em "Deploy", expanda **"Environment Variables"**
   e adicione as **3 variáveis** do seu `.env`:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | (cole o valor do seu .env) |
   | `VITE_SUPABASE_ANON_KEY` | (cole o valor do seu .env) |
   | `VITE_ADMIN_PASSWORD` | (sua senha de admin) |

6. Clique em **"Deploy"**
7. Em 1-2 minutos seu site estará no ar com um link `.vercel.app` 🎉

> 💡 Se cadastrar produtos depois de publicar, eles aparecem
> instantaneamente para qualquer pessoa visitando o site — não precisa
> publicar de novo!

---

## 9. Trocar a senha do admin

A senha padrão é `aurora2026`. Para trocar:

- **Localmente:** edite o valor de `VITE_ADMIN_PASSWORD` no arquivo `.env`
- **No Vercel:** vá em Project → Settings → Environment Variables,
  edite `VITE_ADMIN_PASSWORD` e clique em "Redeploy"

---

## ❓ Problemas comuns

**"Supabase não conectado" aparece no admin**
→ Verifique se o arquivo `.env` existe e tem os valores corretos
  (sem espaços extras, sem aspas)

**As fotos não aparecem depois do upload**
→ Confirme que o bucket `product-images` foi criado como **Público**
  (Storage → product-images → ⚙️ → "Make public")

**Mudei o `.env` mas nada muda**
→ Pare o servidor (`Ctrl+C`) e rode `npm run dev` novamente —
  variáveis de ambiente só são lidas ao iniciar o projeto

---

## 🔒 Sobre a segurança da senha

A senha do `/admin` é simples (verificada no navegador), ideal para
uma loja pequena com poucas pessoas de confiança tendo acesso.
Se no futuro precisar de um login mais robusto (com e-mail e senha
individual para cada funcionária), é possível migrar para o
**Supabase Auth** — é só pedir!
