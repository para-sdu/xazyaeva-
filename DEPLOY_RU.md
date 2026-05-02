# Деплой AZHAR Donation Fund

## Самый простой вариант: Render Blueprint

Проект уже подготовлен к деплою через `render.yaml`. Blueprint создаст:

- PostgreSQL базу `azhar-donation-fund-db`
- backend `azhar-donation-fund-api`
- frontend `azhar-donation-fund`

## 1) Залей проект на GitHub

Создай пустой репозиторий на GitHub и выполни из корня проекта:

```bash
git add .
git commit -m "Prepare production deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2) Создай Blueprint на Render

1. Открой Render Dashboard.
2. Нажми `New` -> `Blueprint`.
3. Подключи GitHub репозиторий.
4. Render найдет `render.yaml`.
5. Нажми `Deploy Blueprint`.

Render сам сгенерирует `JWT_SECRET_KEY` и подключит `DATABASE_URL` из PostgreSQL.

## 3) Проверь URLs

Ожидаемые адреса:

- frontend: `https://azhar-donation-fund.onrender.com`
- backend: `https://azhar-donation-fund-api.onrender.com`
- health check: `https://azhar-donation-fund-api.onrender.com/health`

Если Render изменит имя домена, обнови:

- `VITE_API_BASE_URL` у frontend
- `CORS_ALLOWED_ORIGINS` у backend

## 4) Домен и поиск

Чтобы сайт находили по названию:

1. Купи домен, например `azharfund.kz` или похожий.
2. Подключи домен к frontend-сервису в Render.
3. Добавь сайт в Google Search Console и Yandex Webmaster.
4. После подключения домена добавь `canonical`, `og:url` и `sitemap.xml` с реальным доменом.
