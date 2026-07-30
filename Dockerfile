# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Accept Vite env vars at build time
ARG VITE_API_URL
ARG VITE_RAZORPAY_KEY
ARG VITE_APP_NAME

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_RAZORPAY_KEY=$VITE_RAZORPAY_KEY
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN npm run build

# Serve Stage
FROM nginx:alpine
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
