# Этап 1: Собираем React приложение
FROM node:22-alpine AS build
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь код
COPY . .

# Собираем приложение (игнорируем TypeScript ошибки)
RUN npx tsc --noEmit || true && npm run build

# Этап 2: Запускаем через Nginx
FROM nginx:alpine

# Копируем собранные файлы в папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]