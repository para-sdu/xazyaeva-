# Подключение Supabase (без кода)

1. Открой файл `.env.supabase.example`.
2. Скопируй его в `.env`.
3. Подставь 3 значения из Supabase:
   - `DATABASE_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
4. Запусти backend (Spring Boot) с переменными из `.env`.
5. Запусти frontend:
   - `npm run dev`
6. Открой сайт: `http://127.0.0.1:5174/` (или порт из терминала).

## Где взять значения в Supabase

- `DATABASE_URL`: Connection string (Pooler, порт `6543`) + `?sslmode=require`
- `DB_USERNAME`: обычно `postgres.<project_ref>`
- `DB_PASSWORD`: пароль базы из вашего проекта

## Важно

- Никому не отправляй `.env` (в нем пароль).
- В репозиторий коммитить только `.env.supabase.example`, а не `.env`.
