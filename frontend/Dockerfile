FROM node:14.15.1-alpine as builder

# Set working dir
RUN mkdir /app
WORKDIR /app

# Copy app dependencies
COPY fisher-app/package.json fisher-app/package-lock.json /app/fisher-app/

# Install app dependecies
RUN npm install --prefix fisher-app

# Copy app files 
COPY . /app

# Defauld build conf
ARG configuration=production

# Build app
RUN npm run build --prefix fisher-app -- --output-path=./dist/out --configuration $configuration

# Stage 2 delivery

FROM nginx:1.19.5-alpine

#Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy output directorey from builder to nginx image
COPY --from=builder /app/fisher-app/dist/out /usr/share/nginx/html

# Copy nginx conf file
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
