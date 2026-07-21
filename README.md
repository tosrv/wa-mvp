# WhatsApp Community Broadcast Service

A lightweight WhatsApp Community broadcast relay service built with Node.js, TypeScript, Express, and Baileys.

This service listens to messages from a WhatsApp Community Announcement Group and automatically forwards them to related child groups within the same community.

The main goal:

> Receive announcements once, distribute them automatically.

---

## Overview

Managing announcements across multiple WhatsApp groups can become repetitive and error-prone.

This service provides an automated relay flow:

```text
WhatsApp Community

        |
        v

Announcement Group

        |
        v

WhatsApp Broadcast Service

        |
        +----------------+
        |                |
        v                v

     IT Group       General Group
```

When a message is sent to the Announcement Group, the service detects the event and forwards it to child groups connected to the same community.

---

## Features

### WhatsApp Integration

- QR-based WhatsApp authentication
- Persistent WhatsApp session
- Automatic reconnect
- WhatsApp group metadata loading
- Community group detection

### Message Relay

- Listen to `messages.upsert` events
- Detect Community Announcement Group messages
- Find related child groups
- Forward messages automatically using Baileys forwarding

### REST API

Current endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Service health check |
| GET | `/groups` | View cached WhatsApp groups |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js 22 LTS | Runtime |
| TypeScript | Programming language |
| Express.js | HTTP server |
| Baileys | WhatsApp Web integration |
| Pino | Logging |
| Docker | Deployment |

---

## Architecture

```text
                 WhatsApp

                     |
                     |

              Baileys Socket
              (whatsapp.ts)

                     |
                     |

          messages.upsert event

                     |
                     |

          message.handler.ts

                     |
                     |

          broadcast.service.ts

                     |
                     |

             Child Groups
```

---

## Project Structure

```text
src/
│
├── index.ts
│   └── Application entry point
│
├── app.ts
│   └── Express application setup
│
├── whatsapp.ts
│   └── Baileys socket initialization
│       and WhatsApp lifecycle management
│
├── cache/
│   └── groups.ts
│       └── In-memory WhatsApp group cache
│
├── events/
│   └── message.handler.ts
│       └── Incoming WhatsApp event handler
│
├── services/
│   └── broadcast.service.ts
│       └── Message forwarding logic
│
├── routes/
│   ├── health.route.ts
│   │   └── Health endpoint
│   │
│   └── group.route.ts
│       └── Group information endpoint
│
└── config/
    ├── env.ts
    │   └── Environment configuration
    │
    └── logger.ts
        └── Pino logger configuration
```

---

## Design Principles

This project intentionally avoids unnecessary complexity.

Not included:

- Database
- Redis
- Message queue
- Admin dashboard
- Authentication system
- Microservices

The service focuses on one responsibility:

> Reliable WhatsApp Community message relay.

---

## Installation

Clone repository:

```bash
git clone <repository-url>

cd wa-mvp
```

Install dependencies:

```bash
npm install
```

---

## Environment Configuration

Create `.env`:

```env
PORT=3001
AUTH_FOLDER=auth
NODE_ENV=production
```

---

## Development

Run development server:

```bash
npm run dev
```

The first startup will generate a QR code.

Scan using:

```text
WhatsApp
→ Settings
→ Linked Devices
→ Link a Device
```

---

## Production Build

Compile TypeScript:

```bash
npm run build
```

Run production server:

```bash
npm start
```

---

## Docker Deployment

Build and start:

```bash
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f
```

Stop service:

```bash
docker compose down
```

WhatsApp authentication is stored in the `auth` folder and persisted through Docker volume mapping.

Restarting the container does not require scanning QR again as long as the WhatsApp session remains valid.

---

## Logging

The service logs important lifecycle events:

- Server started
- QR generated
- WhatsApp connected
- Reconnecting
- Group cache loaded
- Announcement detected
- Broadcast execution

Example:

```text
WhatsApp connected.
Loaded 56 groups.
Announcement detected.
```