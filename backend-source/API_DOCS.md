# Spark Backend - API & Architecture Documentation

This document provides a comprehensive overview of the NestJS backend logic, its overall architecture, and a detailed breakdown of all available REST endpoints.

## 🏗️ Architecture & Core Logic

The backend is built with **NestJS**, following a heavily modular architecture. Each feature is isolated into its own module containing Controllers (REST endpoints), Services (business logic), and Entities (Data Models). 

1. **Authentication & Guards**:
   - The application relies on JWT (JSON Web Tokens). Most endpoints require the `JwtAuthGuard` to validate the `Authorization: Bearer <token>` header.
   - The user payload extracted from the JWT token is injected into the request (accessible via `@Request().user` or a custom `@CurrentUser()` decorator parameter).
2. **Database (TypeORM & PostgreSQL)**:
   - Data persists strongly via PostgreSQL.
   - Schema management is handled via `TypeORM` migrations.
3. **Caching & Brokers (Redis)**:
   - Used for quick geo-spatial lookups during discovery and rate-limiting brute force attacks.
   - Used as a Pub/Sub adapter for scaling Socket.io servers.
4. **Real-time WebSockets**:
   - `chat.gateway.ts` handles active bi-directional communication to push real-time messages using the `Socket.io` protocol.

---

## 🛣️ API Endpoints

All endpoints are typically prefixed by the global prefix `/api` (configured in `main.ts`). For example: `http://localhost:3000/api/auth/login`.

### 1. Authentication (`/auth`)
Handles user identity, JWT issuing, and recovery.

*   `POST /auth/register`
    *   **Logic**: Creates a new user record. Hashes the password using `bcrypt`. Fires an event to send a verification email.
*   `POST /auth/login`
    *   **Logic**: Verifies credentials and issues a JWT access token.
*   `GET /auth/verify-email?token=`
    *   **Logic**: Validates the email verification token sent to the user's email and marks the account as verified.
*   `POST /auth/resend-verification`
    *   **Logic**: Re-generates a token and issues a new confirmation email.
*   `POST /auth/forgot-password`
    *   **Logic**: Generates a secure, expiring token for password recovery and sends a recovery email via `nodemailer` / `MailerModule`.
*   `POST /auth/reset-password`
    *   **Logic**: Accepts the secure token and the new password, then updates the user's password securely.
*   `GET /auth/google` & `/auth/google/callback`
    *   **Logic**: Redirects the user to the Google OAuth flow. Creates an account if mapping is missing, otherwise issues a JWT.
*   `GET /auth/facebook` & `/auth/facebook/callback`
    *   **Logic**: Standard OAuth2 flow for Facebook authentication.

### 2. User Profile (`/user`)
Handles standard profile management for the authenticated user. **Requires JWT**.

*   `GET /user/me`
    *   **Logic**: Returns the logged-in user's full profile without returning sensitive password hashes.
*   `PUT /user/profile`
    *   **Logic**: Updates generic string data (name, bio, gender, preference, photos array).
*   `PUT /user/location`
    *   **Logic**: Syncs the mobile/web GPS latitude/longitude. Updates the user's PostGIS spatial data to compute distances during discovery.
*   `PUT /user/interests`
    *   **Logic**: Replaces or modifies the user's tag/interests dictionary.
*   `PUT /user/push-token`
    *   **Logic**: Registers a mobile or web (PWA) Push Notification device token (e.g., Firebase FCM) to allow the server to push match alerts.
*   `POST /user/sync-offline`
    *   **Logic**: Consumes a batch array of actions (like offline swipes) made by the user while detached from the network (PWA offline mode) and resolves them securely on the server.

### 3. Discovery (`/discovery`)
The recommendation loop. **Requires JWT**.

*   `GET /discovery`
    *   **Logic**: Pulls a personalized feed of candidate profiles.
    *   *Under the hood*: It filters out users that the current user has already liked/passed, filters by the user's gender preference, and calculates the absolute geographic distance. Limits results efficiently.
*   `POST /discovery/like`
    *   **Payload**: `{ targetUserId: string, action: 'like' | 'pass' | 'superlike' }`
    *   **Logic**: Records the interaction. If the user likes `targetUserId` AND `targetUserId` has previously liked the current user, the system fires off a "Match". 
    *   *Event*: If a match triggers, it emits a WebSocket event `match_found` to both users.

### 4. Matches (`/match`)
**Requires JWT**.

*   `GET /match`
    *   **Logic**: Returns the list of all successful double-opt-in relationships (Matches) the authenticated user currently holds.

### 5. Chat (`/chat`)
REST support for chat history. (Live messages are Socket.io). **Requires JWT**.

*   `GET /chat/:matchId`
    *   **Logic**: Fetches historical paginated messages for a specific Match ID. Verifies that the requester is legally a participant in this specific match constraint to prevent snooping.

### 6. Safety & Moderation (`/safety`)
Critical endpoints for anti-harassment functionality. **Requires JWT**.

*   `POST /safety/report`
    *   **Payload**: `{ targetUserId: string, reason: string, description: string }`
    *   **Logic**: Flags a user to admin dashboards. May automatically suppress the target user if threshold hits are met.
*   `POST /safety/block`
    *   **Logic**: Hard block. Immediately severs any existing Match instances and blacklists `targetUserId` from ever showing up in the `GET /discovery` feed again.

### 7. Virtual Economy (`/finance`)
In-App purchases and currency flows. **Requires JWT**.

*   `GET /finance/wallet`
    *   **Logic**: Pulls down the current user's available custom coin/credit balance.
*   `POST /finance/deposit`
    *   **Logic**: A mock or Stripe-integrated endpoint indicating real-money fiat converted into in-app currency.
*   `POST /finance/spend`
    *   **Logic**: Deducts an integer amount of coins from the wallet (e.g., spending 5 coins to dispatch a "Super Like" or visibility boost). Validates for sufficient funds using ACID transaction limits.

### 8. Subscriptions (`/subscription` & `/admin`)
Handles Premium tier logic. **Requires JWT**.

*   `GET /subscription/features`
    *   **Logic**: Resolves the user's current subscription level to see what UI panels should be locked or unlocked (e.g., `canSeeWhoLikedMe: true`, `hasUnlimitedSwipes: false`).
*   `POST /subscription/checkout`
    *   **Logic**: Generates a Stripe Checkout URL for purchasing Tinder-Gold-like premium.
*   `POST /subscription/webhook`
    *   **Logic**: *Public endpoint.* Stripe hits this server-to-server webhook directly upon successful card capture to asynchronously upgrade the user's profile tier.
*   `GET`/`POST /admin`
    *   **Logic**: Role-based access control endpoints for administrators to update global toggle configurations.

### 9. Notifications (`/notification`)
In-app state alerts. **Requires JWT**.

*   `GET /notification`
    *   **Logic**: Gets a list of historic alerts: "User X liked you", "You have a new match!", "Subscription processed."
*   `POST /notification/:id/read`
    *   **Logic**: Modifies the `isRead` flag of a specific notification to `true`, clearing the unread UI bubble.

---

## 📡 WebSockets: Real-Time Engine (Socket.IO)
Located in `backend-source/src/chat/chat.gateway.ts`.

Instead of polling the REST endpoints, clients connect over WebSockets for live status feeds:

*   **Connection Validation**: Clients must pass their JWT in the handshake: `auth: { token: '...' }`.
*   **Emitting `send_message`**: Format: `{ matchId: 'abc', content: 'hello' }`. Server saves the chat directly to PostgreSQL and instantly broadcasts to the other connected user.
*   **Listening to `receive_message`**: UI listener for incoming live chats.
*   **Listening to `match_found`**: Instant banner to immediately notify a user while swiping that the person they just liked, liked them back.
