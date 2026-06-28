# Frontend Application

This document summarizes the Vue 2 frontend module.

## Requirements

- Node.js 16.13.2
- npm 8.x

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:9192
```

The API client is configured in:

```text
src/utils/request.js
```

It currently sends requests to:

```text
http://localhost:9191
```

## Verification

```bash
npm run check:auth
npm run check:routes
npm run build
```

## Build

```bash
npm run build
```
