# PronoFoot Backend — NestJS

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and FOOTBALL_API_KEY

npx prisma generate
npx prisma migrate deploy
npx prisma db seed

npm run start:dev
```

## API Docs
http://localhost:3000/api/docs

## Cron jobs
- Sync matches: every 15 min
- Calculate points: every 15 min (offset by 2s)

## Deploy (Railway)
Set env vars: DATABASE_URL, FOOTBALL_API_KEY, PORT=3000
