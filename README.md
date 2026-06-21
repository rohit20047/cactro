# Event Management & Ticket Booking System

This is the backend API for the Event Management & Ticket Booking System, built with Node.js, TypeScript, Prisma ORM, Neon (PostgreSQL), and BullMQ.

## Features & Architecture

- **Role-Based Access Control (RBAC)**: Distinct permissions for `ORGANIZER` and `CUSTOMER`.
- **Event Management**: Organizers can create, update, delete, and view their events and bookings.
- **Ticket Booking**: Customers can browse events and book tickets securely. Concurrency issues are mitigated via Prisma Transactions.
- **Background Jobs (BullMQ + Redis)**:
  - **Booking Confirmation**: Simulates sending a confirmation email when a customer books tickets.
  - **Event Update Notification**: Notifies all customers who booked an event when the organizer updates it.
- **Scalable Structure**: Built using Clean Architecture (Controllers, Services, Repositories, Middleware, Validators).
- **Validation & Error Handling**: Strict runtime validation using Zod and a unified global error handler.

## Design Decisions & Trade-offs

1. **Technology Choices**: 
   - **Prisma ORM**: Chosen for its robust type safety and excellent developer experience compared to TypeORM.
   - **BullMQ**: Selected for scalable, Redis-backed asynchronous job processing.
2. **Database Design**:
   - `User`, `Event`, and `Booking` models linked via standard one-to-many relationships.
   - Using UUIDs for secure distributed keys.
3. **Queue Implementation**: 
   - We utilize `ioredis` to connect to a Redis instance.
   - Two separate queues (`emailQueue`, `notificationQueue`) are instantiated to isolate failure domains.
   - The workers log to the console to simulate external integrations (e.g., SendGrid/AWS SES).
4. **Validation & Error Handling**:
   - All external inputs are intercepted by Zod schemas at the controller level.
   - Custom `AuthError`, `EventError`, and `BookingError` classes are passed to the `next(error)` function to be properly mapped to HTTP status codes by the global middleware.
5. **Assumptions & Trade-offs**:
   - Assumes Redis is running locally on port 6379 (can be overridden via `REDIS_URL`).
   - Using `Prisma.$transaction` during booking ensures atomicity when reducing available tickets, preventing race conditions.

## Setup Instructions

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://neondb_owner:npg_EUcWC3JI5OHy@ep-winter-forest-a8zm1gzz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
JWT_SECRET="event_management_super_secret_key_2026"
JWT_EXPIRES_IN="1d"
REDIS_URL="redis://127.0.0.1:6379"
```

### Installation
```bash
npm install
```

### Running Migrations
```bash
npx prisma db push
```

### Running the Application
Ensure you have Redis running (e.g., via Docker: `docker run -p 6379:6379 -d redis`).
**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication APIs (Public)
- `POST /auth/register` (name, email, password, role)
- `POST /auth/login` (email, password)

### Event APIs
- `GET /events` (Public) - Browse all events
- `GET /events/:id` (Public) - View specific event details
- `POST /events` (Organizer) - Create an event
- `PUT /events/:id` (Organizer) - Update event & Trigger notification job
- `DELETE /events/:id` (Organizer) - Delete event
- `GET /events/my-events` (Organizer) - View organizer's events
- `GET /events/:id/bookings` (Organizer) - View bookings for an event

### Booking APIs
- `POST /bookings` (Customer) - Book tickets & Trigger confirmation job
- `GET /bookings/my-bookings` (Customer/Organizer) - View user's bookings
