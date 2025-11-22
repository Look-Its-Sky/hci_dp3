# Builder
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN rm -rf build
RUN yarn build

# Runtime
FROM node:24-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=build /app/build ./build
CMD ["yarn", "serve", "-s", "build", "-l", "3000"]
