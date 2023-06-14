# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16 as build-stage

WORKDIR /app
COPY src/ /app/src/
COPY public/ /app/public/
COPY yarn.lock/ /app/yarn.lock
COPY package.json/ /app/package.json
COPY tsconfig.json/ /app/tsconfig.json
COPY config-overrides.js/ /app/config-overrides.js

RUN yarn install
RUN yarn run build

FROM nginx:1.24
COPY --from=build-stage /app/build/ /var/www/study-planner/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
