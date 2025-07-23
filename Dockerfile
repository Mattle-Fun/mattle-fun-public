FROM node:22
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build
EXPOSE 3005
CMD ["npm", "run", "dev"]
