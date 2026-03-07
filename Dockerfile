# syntax=docker/dockerfile:1.7

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG MONGODB_URI=mongodb://host.docker.internal:27017/portfolio-ci
ARG NEXTAUTH_URL=http://localhost:3000
ARG NEXTAUTH_SECRET=ci-nextauth-secret
ARG JWT_SECRET=ci-jwt-secret
ARG GOOGLE_CLIENT_ID=ci-google-client-id
ARG GOOGLE_CLIENT_SECRET=ci-google-client-secret

ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV JWT_SECRET=$JWT_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
