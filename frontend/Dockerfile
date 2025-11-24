FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps && \
    cd /app && \
    npm install ajv@^8.12.0 --legacy-peer-deps --force && \
    ls -la node_modules/ajv/dist/compile/ || echo "ajv structure check"

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

