FROM node:22-alpine 
# Рабочая директория 
WORKDIR /app 
# Устанавливаем только prod-зависимости для сборки 
COPY package*.json ./ 
# Копируем только нужные файлы для запуска 
RUN npm ci --omit=dev 
# Копируем собранный код с предыдущего этапа 
COPY . . 
# Создаём temp для multer 
RUN mkdir -p /app/temp 
EXPOSE 3000 
# Запуск приложения 
CMD ["node", "src/index.js"]

