# Spark Dating App - Full Documentation

## Architecture & Integration Design

Spark is structured as a full-stack application, divided into two main components:
1. **Frontend**: React (Vite, TypeScript, Tailwind CSS, Zustand, Framer Motion)
2. **Backend**: NestJS (TypeScript, TypeORM, PostgreSQL, Redis, Socket.IO)

### How Components Communicate

**1. Client to API (REST endpoints)**
The frontend communicates with the backend via standard HTTP requests (GET, POST, PUT, DELETE).
- **Authentication**: JWT tokens are used. Upon successful login/OAuth, the backend issues an access token. The frontend stores this token and includes it in the `Authorization: Bearer <token>` header of subsequent requests to protected endpoints.
- **REST Integrations**: Actions such as modifying a profile, swiping left/right (`/discovery/like`, `/discovery/pass`), reporting users, purchasing features, and modifying discovery preferences are handled via REST APIs provided by the NestJS modules.

**2. Real-Time Communication (WebSockets)**
In a dating app, instant feedback is crucial (e.g., instant messaging and match notifications). We utilize WebSockets (via Socket.IO) integrated into the NestJS backend and accessed by the frontend.
- **Chat**: When users are matched, they join a socket room named by the `matchId`. Messages are pushed in real-time.
- **Notifications**: "New Match" or "Super Like" notifications are emitted to specific user streams over WebSockets.

**3. Internal Backend Communication**
NestJS adheres to modular architecture. Modules (e.g., Auth, User, Match, Finance) encapsulate functionality.
- Services from one module are exported and imported by others (e.g., `DiscoveryService` uses `MatchService` to create a match if both users like each other).
- Data flows hierarchically from Controller -> Service -> Repository -> Database.

### Functional Design
- **Authentication**: JWT-based with options for Google and Facebook OAuth strategy integration via Passport.
- **Discovery Engine**: Users fetch potential profiles based on their preferences (age, distance, filters). This works optimally through custom SQL queries or algorithms mapping geospatial data. Redis can cache these heavy computational match queries.
- **Matching & Chat**: Standard double-opt-in matching system. If User A likes B, and B likes A, a Match record is created. Then, they are granted access to a Chat room.
- **Wallet & Subscriptions**: Simulates an in-app economy. Users can deposit funds via Mock Stripe checkout and use wallet balances or subscriptions to unlock premium capabilities (e.g., read receipts, stealth mode).

## Redis: Why, What, and How

### What is Redis?
Redis is an in-memory data structure store, used mostly as a caching layer or message broker.

### Why use Redis in Spark?
1. **Caching Discovery Queries**: Getting matching profiles requires joining massive relational tables and computing Geo-Distance. Redis caches "Nearby Profiles" to take the load off the database.
2. **Throttling & Rate Limiting**: Limit the number of profile queries or login attempts to reduce brute-force and DDoS risks.
3. **Session State / WebSockets**: Socket.IO often requires an adapter when scaled across multiple servers. Redis acts as the message broker (Redis Pub/Sub) making sure a socket connection on Instance A can broadcast a chat message to a user connected on Instance B.
4. **Queueing**: For background tasks (e.g., sending emails or matching algorithms), integrating Redis via BullMQ is an optimal choice.

### How it Connects
The application references Redis via the `RedisService` inside `src/common/redis.service.ts` using the `ioredis` library. It initializes a connection securely based on your `.env` coordinates (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`). 

## Connecting Backend to Frontend Locally

To get the functional app running together horizontally, you need to spin up the independent development environments.

### 1. Requirements
Ensure you have the following background services running on your local machine:
- **PostgreSQL**: Running on port `5432` with a database named `spark_db`.
- **Redis**: Running on port `6379`.

### 2. Configure Environment Variables
Inside the root folder, create or modify the `.env` (using `.env.example` as a template):
```env
# URL Configuration
FRONTEND_URL=http://localhost:5173
APP_URL=http://localhost:3000

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=spark_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=super_secret_jwt_key_change_me_in_production
```

### 3. Run Migrations (Backend)
Because a database is not active inside the AI Studio container, the TypeORM migrations must be generated on your local machine connecting to Postgres:
```bash
# Go to the backend folder
cd backend-source

# Install dependencies if you haven't natively
npm install

# Generate the initial migration directly based on the schemas
npm run typeorm migration:generate -d src/data-source.ts -- -n InitialMigration

# Run the migration
npm run typeorm migration:run -d src/data-source.ts
```

### 4. Running the Backend Subsystem
```bash
cd backend-source
npm run start:dev
```
The NestJS server will start on `http://localhost:3000`.

### 5. Running the Frontend Subsystem
From a new terminal window:
```bash
# Setup correct .env variable for Vite to target the backend API
echo "VITE_API_URL=http://localhost:3000/api" > .env
echo "VITE_SOCKET_URL=http://localhost:3000" >> .env

# Run the frontend server
npm run dev
```
The frontend application will be active over Vite locally (typically `http://localhost:5173`).

---
_Note: If you encounter Vite import URL errors (like ERR_INVALID_URL_SCHEME), ensure that your Node version is compatible or run `npx tsx server.ts` instead if you want the custom Express fallback server script included in the codebase._
