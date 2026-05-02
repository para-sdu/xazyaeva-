# Готовый запуск сайта (frontend + backend + PostgreSQL)

## 1) Frontend

```bash
npm install
npm run dev
```

Откроется примерно: `http://127.0.0.1:5173/` (или другой порт из терминала).

## 2) Backend

1. Перейди в папку backend:

```bash
cd "src 2"
```

2. Создай `.env` на основе шаблона:

```bash
cp ../.env.backend.example .env
```

3. Для локального запуска `.env` можно не заполнять: backend сам использует H2-базу в папке `data/` и dev JWT secret.

Для production обязательно задай:
- `DATABASE_URL`
- `JWT_SECRET_KEY`

4. Запусти backend:

```bash
mvn spring-boot:run
```

Если основная Java в системе новее 17 и Maven падает на компиляции, используй локальный JDK из этой папки:

```bash
export JAVA_HOME="$PWD/../.local-jdk/jdk-17.0.19+10/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
./mvnw spring-boot:run
```

Backend будет на `http://localhost:8080`.

## 3) API для frontend

Во frontend уже используется:

- `VITE_API_BASE_URL=http://localhost:8080/api/v1` (по умолчанию)

Если backend на другом домене, задай `VITE_API_BASE_URL` в `.env`.

## 4) Render / Production

Достаточно переменных:

- `DATABASE_URL` (или `SPRING_DATASOURCE_URL`)
- `JWT_SECRET_KEY`
- `CORS_ALLOWED_ORIGINS`
- `PORT` (Render обычно задает сам)

## 5) Проверка

- `GET /health` должен отвечать `OK`
- главная страница должна загружать проекты/статистику без CORS ошибок
