# Stage 1: Build app
FROM node:20.11-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x node_modules/.bin/next


RUN npm run build

# Stage 2: Run app
FROM node:20.11-alpine

RUN adduser -D loc123

WORKDIR /run

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

RUN chown -R loc123:loc123 /run

USER loc123

EXPOSE 3000

CMD ["npm", "start"]
