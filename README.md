# Multi-tenant WhatsApp Bot Backend

This project provides a scalable WhatsApp bot backend for multiple small businesses using PostgreSQL and Prisma.
User-facing messages are in Spanish; code is in English.

## Structure

```
src/
├── bot/
│   ├── botClient.ts
│   ├── botMessageHandler.ts
│   └── states/
│       ├── welcomeState.ts
│       ├── registerNameState.ts
│       ├── registerAddressState.ts
│       ├── showCatalogState.ts
│       ├── selectProductState.ts
│       └── confirmOrderState.ts
├── config/
│   ├── constants.ts
│   ├── sessionManager.ts
│   └── catalog.ts
├── database/
│   ├── prismaClient.ts
│   └── setupNewCompany.ts
├── utils/
│   └── messageFormatter.ts
├── server.ts
├── types.ts
└── README.md
```

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. `npm install`
3. `npx prisma migrate dev`
4. `npm run dev`

