FROM node:20
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production 
FROM nginx:alpine
COPY --from=build /dist /usr/share/nginx/html

EXPOSE 80
CMD ["npm", "serve", "-s", "build", "-l", "3000"]