FROM registry.avapardaz.org/modirlo/backendbase:latest

WORKDIR /app

COPY . .

RUN npm run build
