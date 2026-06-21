# Event Management & Ticket Booking System

This is a production-ready backend API for an Event Management & Ticket Booking System. It supports robust role-based access control, allowing Organizers to manage events while Customers can securely browse and book tickets.

## Technologies Used

- **TypeScript Backend**: Strongly-typed Node.js + Express application.
- **Neon PostgreSQL**: Serverless PostgreSQL database for high availability.
- **Prisma ORM**: Next-generation Node.js and TypeScript ORM for safe database access.
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Role-Based Access Control**: Strict `ORGANIZER` and `CUSTOMER` route protections.
- **Event and Booking Management**: Fully transactional endpoints to prevent race conditions.
- **Background Task Processing**: Native in-memory async processing for emails and notifications.
- **Zod Validation**: Robust runtime schema validation for all API inputs.
- **Layered Architecture**: Clean separation into Controllers, Services, Repositories, and Validators.

## Database Tables

The application relies on three primary database models configured via Prisma:

### 1. User
Stores authentication and role information.
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: `ORGANIZER` | `CUSTOMER`)
- `createdAt` / `updatedAt`

### 2. Event
Stores details about events created by organizers.
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (String)
- `venue` (String)
- `eventDate` (DateTime)
- `totalTickets` (Int)
- `availableTickets` (Int, Decremented upon booking)
- `organizerId` (UUID, Foreign Key to `User`)
- `createdAt` / `updatedAt`

### 3. Booking
Stores customer ticket reservations.
- `id` (UUID, Primary Key)
- `ticketCount` (Int)
- `customerId` (UUID, Foreign Key to `User`)
- `eventId` (UUID, Foreign Key to `Event`)
- `createdAt` / `updatedAt`

## Features & Architecture

- **Role-Based Access Control (RBAC)**: Distinct permissions for `ORGANIZER` and `CUSTOMER`.
- **Event Management**: Organizers can create, update, delete, and view their events and bookings.
- **Ticket Booking**: Customers can browse events and book tickets securely. Concurrency issues are mitigated via Prisma Transactions.
- **Background Jobs (In-Memory Async Processing)**:
  - **Booking Confirmation**: Simulates sending a confirmation email asynchronously when a customer books tickets.
  - **Event Update Notification**: Notifies all customers who booked an event asynchronously when the organizer updates it.
- **Scalable Structure**: Built using Clean Architecture (Controllers, Services, Repositories, Middleware, Validators).
- **Validation & Error Handling**: Strict runtime validation using Zod and a unified global error handler.

## Design Decisions & Trade-offs

1. **Technology Choices**: 
   - **Prisma ORM**: Chosen for its robust type safety and excellent developer experience compared to TypeORM.
2. **Database Design**:
   - `User`, `Event`, and `Booking` models linked via standard one-to-many relationships.
   - Using UUIDs for secure distributed keys.
3. **Queue Implementation**: 
   - We utilize Node's native event loop (via `setTimeout` and async functions) as an in-memory job processing mechanism.
   - This keeps the project completely self-contained and avoids the overhead of managing an external Redis instance, making it perfect for rapid local testing.
   - The "workers" log to the console to simulate external integrations (e.g., SendGrid/AWS SES).
4. **Validation & Error Handling**:
   - All external inputs are intercepted by Zod schemas at the controller level.
   - Custom `AuthError`, `EventError`, and `BookingError` classes are passed to the `next(error)` function to be properly mapped to HTTP status codes by the global middleware.
5. **Assumptions & Trade-offs**:
   - Using `Prisma.$transaction` during booking ensures atomicity when reducing available tickets, preventing race conditions.
   - Since we are using an in-memory queue, background jobs will be lost if the server restarts unexpectedly. In a real production environment, this would be replaced with a persistent message broker (like BullMQ + Redis, RabbitMQ, or AWS SQS).

## Setup Instructions

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://neondb_owner:npg_EUcWC3JI5OHy@ep-winter-forest-a8zm1gzz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
JWT_SECRET="event_management_super_secret_key_2026"
JWT_EXPIRES_IN="1d"
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
