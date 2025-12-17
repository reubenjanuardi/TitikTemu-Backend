# TitikTemu Prisma Setup Guide

This guide explains how to set up and configure Prisma ORM for TitikTemu microservices with Supabase PostgreSQL.

## Overview

TitikTemu uses a **schema-per-service** isolation pattern with Prisma ORM:
- Each service has its own PostgreSQL schema
- Each service uses its own database user with limited permissions
- No foreign key constraints between schemas
- Communication between services via REST APIs only

## Services & Schemas

| Service           | Schema              | Database User      | Port |
|-------------------|---------------------|--------------------|------|
| Auth Service      | `auth_schema`       | `auth_user`        | 3001 |
| Event Service     | `event_schema`      | `event_user`       | 3002 |
| Attendance Service| `attendance_schema` | `attendance_user`  | 3004 |

## Prerequisites

- Node.js 16+ installed
- Supabase account and PostgreSQL instance
- Supabase connection string

## Setup Instructions

### 1. Database Setup in Supabase

For each service, create:

#### Auth Schema Setup
```sql
-- Create auth_schema
CREATE SCHEMA IF NOT EXISTS auth_schema;

-- Create auth_user with limited permissions
CREATE USER auth_user WITH PASSWORD 'your_secure_password';
GRANT USAGE ON SCHEMA auth_schema TO auth_user;
GRANT CREATE ON SCHEMA auth_schema TO auth_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth_schema TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_schema GRANT ALL ON TABLES TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_schema GRANT ALL ON SEQUENCES TO auth_user;
```

#### Event Schema Setup
```sql
CREATE SCHEMA IF NOT EXISTS event_schema;

CREATE USER event_user WITH PASSWORD 'your_secure_password';
GRANT USAGE ON SCHEMA event_schema TO event_user;
GRANT CREATE ON SCHEMA event_schema TO event_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA event_schema TO event_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA event_schema GRANT ALL ON TABLES TO event_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA event_schema GRANT ALL ON SEQUENCES TO event_user;
```

#### Attendance Schema Setup
```sql
CREATE SCHEMA IF NOT EXISTS attendance_schema;

CREATE USER attendance_user WITH PASSWORD 'your_secure_password';
GRANT USAGE ON SCHEMA attendance_schema TO attendance_user;
GRANT CREATE ON SCHEMA attendance_schema TO attendance_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA attendance_schema TO attendance_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA attendance_schema GRANT ALL ON TABLES TO attendance_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA attendance_schema GRANT ALL ON SEQUENCES TO attendance_user;
```

### 2. Configure Environment Variables

Update `.env` file in each service with your Supabase credentials:

**Auth Service** (`services/auth-service/.env`):
```
DATABASE_URL="postgresql://auth_user:your_password@your_supabase_host:5432/postgres?schema=auth_schema"
JWT_SECRET="your_secret_key"
JWT_EXPIRE="7d"
NODE_ENV="development"
PORT=3001
```

**Event Service** (`services/event-service/.env`):
```
DATABASE_URL="postgresql://event_user:your_password@your_supabase_host:5432/postgres?schema=event_schema"
NODE_ENV="development"
PORT=3002
```

**Attendance Service** (`services/attendance-service/.env`):
```
DATABASE_URL="postgresql://attendance_user:your_password@your_supabase_host:5432/postgres?schema=attendance_schema"
NODE_ENV="development"
PORT=3004
```

### 3. Install Dependencies

For each service:

```bash
cd services/auth-service
npm install

cd ../event-service
npm install

cd ../attendance-service
npm install
```

### 4. Generate Prisma Client

For each service:

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

For each service:

```bash
npm run prisma:migrate
```

This will:
- Create migrations folder
- Generate migration files based on schema.prisma
- Apply migrations to the database

### 6. Start Services

In separate terminal windows:

```bash
# Auth Service
cd services/auth-service
npm run dev

# Event Service
cd services/event-service
npm run dev

# Attendance Service
cd services/attendance-service
npm run dev
```

## Prisma Schema Files

Each service has a `prisma/schema.prisma` file:

- **auth-service**: Defines `User` model for auth_schema
- **event-service**: Defines `Event` model for event_schema
- **attendance-service**: Defines `Attendance` model for attendance_schema

**Important**: No foreign key constraints exist between schemas to maintain isolation.

## Key Principles

### 1. No Cross-Schema Foreign Keys
Each service maintains data independence. EventId and UserId in Attendance are stored as strings without foreign key references.

### 2. One Database User Per Service
Services do not share credentials. Each user has minimal required permissions.

### 3. REST API Communication
Services communicate via HTTP REST APIs. There is no direct database-to-database communication.

### 4. No Admin Access in Services
No service connects using the PostgreSQL admin user. All services use their own dedicated users.

## Troubleshooting

### Migration Issues
```bash
# Reset local database (development only)
npx prisma migrate reset

# Create migration without applying
npx prisma migrate dev --create-only

# View migration status
npx prisma migrate status
```

### Connection Issues
- Verify Supabase is running
- Check DATABASE_URL format includes `?schema=schema_name`
- Ensure user has permissions for the schema
- Test connection: `psql postgresql://user:pass@host/postgres?schema=schema`

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

## Production Deployment

For production (cloud deployment):

1. Use strong passwords for database users
2. Rotate JWT secrets
3. Use environment variables from secrets manager
4. Run: `npm run prisma:migrate:prod` instead of `prisma migrate dev`
5. Keep migrations in version control
6. Test migrations in staging first

## API Examples

### Auth Service

```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass"}'

# Validate Token
curl -X POST http://localhost:3001/auth/validate \
  -H "Authorization: Bearer <token>"
```

### Event Service

```bash
# Create Event
curl -X POST http://localhost:3002/events \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Tech Conference",
    "description":"Annual tech conference",
    "startTime":"2024-01-15T09:00:00Z",
    "endTime":"2024-01-15T17:00:00Z"
  }'

# Get All Events
curl http://localhost:3002/events

# Get Event by ID
curl http://localhost:3002/events/{id}
```

### Attendance Service

```bash
# Record Attendance
curl -X POST http://localhost:3004/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "eventId":"event-uuid",
    "userId":"user-uuid",
    "checkInTime":"2024-01-15T09:15:00Z"
  }'

# Get Event Attendance
curl http://localhost:3004/attendance/event/{eventId}

# Get Attendance Stats
curl http://localhost:3004/attendance/stats/{eventId}
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- [Microservices Patterns](https://microservices.io/)
