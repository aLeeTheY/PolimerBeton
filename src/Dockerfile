#? --- Stage 1. Build frontend via Gulp
#? ------------------------------------
FROM node:26.10-slim AS frontend_builder
WORKDIR /usr/src/polimerbeton

# ! --- IMPORTANT !!! | env-переменные для Puppeteer внутри Linux-контейнера
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ffmpeg \
        python3 \
        python3-pip \
        chromium \
    && pip install --no-cache-dir --break-system-packages foundrytools-cli \
    && rm -rf /var/lib/apt/lists/*

# 1. Кэширование npm-зависимостей
COPY package.json package-lock.json .npmrc ./
COPY src/frontend/package.json ./src/frontend/

# * Флаг --ignore-scripts отключает prepare и postinstall скрипты (husky & md:decode)
RUN npm ci --workspace=src/frontend --ignore-scripts && npm cache clean --force

# 2. Копируем исходный код
COPY src ./src

# 3. Запускаем сборку Gulp
WORKDIR /usr/src/polimerbeton/src/frontend
RUN npm run django -- --verbose

#? --- Stage 2. Install Python dependencies
#? ----------------------------------------
FROM python:3.14-slim AS backend_builder
WORKDIR /usr/src/polimerbeton/src/backend

# 1. Настройка переменных окружения для Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir poetry
COPY src/backend/pyproject.toml src/backend/poetry.lock ./

RUN poetry config virtualenvs.create false \
    && poetry install --no-root --with dev

#? --- Stage 3. Execute "development" scenario
#? -------------------------------------------
FROM python:3.14-slim AS development

# 1. Создание необходимых каталогов
ENV HOME=/root \
    APP_HOME=/root/www/polimerbeton

WORKDIR $APP_HOME

# 2. Обновление и установка системных пакетов
RUN apt-get update \
    && apt-get install -y --no-install-recommends netcat-openbsd ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 1. Забираем скомпилированный Python и библиотеки из Stage 2
COPY --from=backend_builder /usr/local /usr/local

# 2. Забираем ИСКЛЮЧИТЕЛЬНО папку backend из Stage 1 (где уже лежит собранная статика)
COPY --from=frontend_builder /usr/src/polimerbeton/src/backend $APP_HOME/backend

# 3. Настройка переменных окружения для Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR $APP_HOME/backend

# 4. Настройка и запуск entrypoint.sh
RUN sed -i 's/\r$//g' $APP_HOME/backend/scripts/entrypoint.sh \
    && chmod +x $APP_HOME/backend/scripts/entrypoint.sh

ENTRYPOINT ["/root/www/polimerbeton/backend/scripts/entrypoint.sh"]
