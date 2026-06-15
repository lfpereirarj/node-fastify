# 🚀 Node.js Fastify Boilerplate (Clean Architecture)

Boilerplate de alto desempenho e production-ready para APIs em Node.js, utilizando o ecossistema nativo de ESM (ECMAScript Modules), Fastify, Prisma ORM e testes guiados por TDD.

## 🛠️ Tecnologias & Ferramentas

- **Runtime:** Node.js v22+ (ESM nativo)
- **Web Framework:** [Fastify](https://fastify.dev/) (Alta performance e baixo overhead)
- **Banco de Dados:** PostgreSQL & [Prisma ORM](https://www.prisma.io/)
- **Validação:** [Zod](https://zod.dev/) (Type-safe validation)
- **Qualidade de Código:** [Biome](https://biomejs.dev/) (Linter e Formatador ultra-rápido)
- **Testes:** Node.js Native Test Runner (Zero dependências externas como Jest)
- **Documentação:** [Scalar](https://scalar.com/) (Interface moderna e interativa para OpenAPI/Swagger)
- **Containerização:** Docker (Multi-stage builds otimizados para produção)
- **CI/CD:** GitHub Actions (Pipeline automatizado de Lint, Testes, DB Migrations e Build)

---

## 📐 Arquitetura do Projeto

O projeto foi desenhado seguindo uma abordagem pragmática baseada em Casos de Uso (UseCases) e isolamento de domínio, garantindo que as regras de negócio fiquem desacopladas dos detalhes de infraestrutura.

```text
src/
├── modules/             📦 Módulos de domínio da aplicação
│   └── users/           👤 Domínio de Usuários
│       ├── repos/       🗄️ Camada de dados (Interfaces, Prisma e Repositório em Memória)
│       └── useCases/    🧠 Casos de Uso (Regras de negócio e seus respetivos testes .spec)
├── shared/              🛡️ Componentes partilhados globais (Ex: AppError)
├── app.ts               ⚙️ Configuração do Fastify, Plugins, Zod, Rotas e Scalar
└── server.ts            🚀 Ponto de entrada (Boot do servidor HTTP)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

* Node.js v22 ou superior instalado.
* Docker e Docker Compose instalados.

### 1. Clonar o Repositório e Instalar Dependências

```bash
git clone [https://github.com/seu-usuario/nome-do-repositorio.git](https://github.com/seu-usuario/nome-do-repositorio.git)
cd nome-do-repositorio
npm install

```

### 2. Configurar Variáveis de Ambiente

Duplique o arquivo `.env.example` para `.env` e ajuste se necessário:

```bash
cp .env.example .env

```

### 3. Subir o Banco de Dados (Docker)

Inicie o container do PostgreSQL configurado no projeto:

```bash
docker compose up -d

```

### 4. Executar as Migrations do Prisma

Aplique a estrutura de tabelas no banco de dados local:

```bash
npx prisma migrate dev

```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev

```

A API estará rodando em `http://localhost:3333`.

---

## 📖 Documentação da API (Interactive Docs)

Com o servidor local rodando, acesse a documentação interativa gerada dinamicamente pelo **Scalar**:

👉 **[http://localhost:3333/docs](https://www.google.com/search?q=http://localhost:3333/docs)**

A documentação lê os schemas do **Zod** nativamente, fornecendo exemplos de payloads de requisição, status codes de resposta e um cliente HTTP integrado para testes em tempo real.

---

## 🧪 Suíte de Testes (TDD)

O projeto utiliza o **Test Runner nativo do Node.js**, garantindo execuções em milissegundos. Os testes cobrem cenários unitários e de integração (In-Memory Repositories).

Para rodar todos os testes:

```bash
npm run test

```

Para rodar os testes em modo Watch (desenvolvimento contínuo):

```bash
npm run test:watch

```

---

## 🧹 Qualidade de Código (Lint & Format)

Utilizamos o **Biome** para garantir padrões rígidos de escrita de código.

Verificar inconformidades:

```bash
npm run lint

```

Corrigir formatação e organizar imports automaticamente:

```bash
npm run format

```

---

## 🐳 Produção & Deploy (Docker)

Para buildar e rodar o container de produção simulando o ambiente de nuvem localmente:

```bash
docker build -t node-fastify-api .
docker run -p 3333:3333 --env-file .env node-fastify-api

```

*O Dockerfile utiliza o padrão de **Multi-stage Build**, reduzindo o tamanho final da imagem em até 80% ao descartar o TypeScript e as devDependencies no ambiente de execução.*

```

---

### Ritual de Fechamento de Ouro 🪙

Agora que você tem o README, rode a checagem do Biome para garantir que ele não encontra nenhuma quebra de formato, faça o commit do arquivo e envie para a nuvem:

```bash
npx @biomejs/biome check --write .
git add README.md
git commit -m "docs: add comprehensive production-ready README"
git push origin main
