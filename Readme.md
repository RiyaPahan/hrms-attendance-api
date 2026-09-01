# HRMS Attendance API

Backend API for an HRMS attendance system built using Node.js, TypeScript, Express.js, PostgreSQL and JWT.

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* JWT
* bcrypt
* pg

## Project Structure

```text
src/
├── controllers/
├── routes/
├── services/
├── repositories/
├── middleware/
├── utils/
├── config/
└── app.ts
```

I have separated the application into routes, controllers, services and repositories to keep the code maintainable.

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_attendance
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

Create the PostgreSQL database and run the database schema/migrations.

Start the project:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Authentication

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```

The API returns a JWT token. Protected APIs require:

```text
Authorization: Bearer <token>
```

Passwords are stored using bcrypt hashing.

## Employee APIs

Only ADMIN users can manage employees.

```text
POST   /api/employees
GET    /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
DELETE /api/employees/:id
```

New employees are created with the `EMPLOYEE` role.

## Attendance APIs

Only authenticated EMPLOYEE users can access these APIs.

```text
POST /api/attendance/punch-in
POST /api/attendance/punch-out
GET  /api/attendance/my
```

The employee ID is taken from the JWT and is not trusted from the request body.

Business rules include:

* Employee cannot punch in multiple times for the same day.
* Punch-out requires punch-in.
* Punch-out cannot be done twice.
* Employee can only view their own attendance.

## Admin Attendance Report

Only ADMIN users can access:

```http
GET /api/admin/attendance?from=2026-08-01&to=2026-08-31
```

Employee filter:

```http
GET /api/admin/attendance?from=2026-08-01&to=2026-08-31&employeeId=4
```

The report contains:

* Employee name
* Employee code
* Date
* Punch-in
* Punch-out
* Total working hours

## Duplicate Requests

A unique database constraint on:

```text
employee_id + date
```

prevents duplicate attendance records.

This also protects against multiple punch-in requests arriving at the same time.

## Validation and Error Handling

Request data is validated before processing.

The application uses centralized error handling and returns meaningful HTTP status codes such as:

```text
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
500 - Internal Server Error
```

Sensitive error details and stack traces are not returned to the client.


## Environment

`.env` is not committed to GitHub. A `.env.example` file is provided without real credentials.
