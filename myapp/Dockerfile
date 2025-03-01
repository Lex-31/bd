# Dockerfile
FROM node:14

# Установить рабочую директорию
WORKDIR /usr/src/app

# Скопировать package.json и package-lock.json
COPY package*.json ./

# Установить зависимости
RUN npm install

# Скопировать исходный код приложения
COPY . .

# Открыть порт, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "server.js"]
