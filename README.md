# Diet Time Backend

REST API service for the Diet Time application built with Express.js and TypeScript.

## Project Structure

```
src/
├── config/       # Configuration files and environment setup
├── controllers/  # Request handlers
├── middleware/   # Express middleware
├── models/       # Database models
├── routes/       # API routes
├── services/     # Business logic
├── types/        # TypeScript type definitions
└── index.ts      # Application entry point
```

## Technologies

- Node.js with Express.js framework
- TypeScript for type safety
- PostgreSQL database
- JWT for authentication
- Docker for containerization

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create environment files:
   ```
   cp .env.example .env
   ```

3. Run in development mode:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Start production server:
   ```
   npm start
   ```

## Running with Docker

1. Create the necessary environment files:
   ```
   cp .env.example .env
   ```

2. Start the application with Docker Compose:
   ```
   docker-compose up -d
   ```

3. The Backend API service will be available at http://localhost:5000.
   
## Database Information

The application uses PostgreSQL with the following connection details when running with Docker:

```
Host: localhost
Port: 5433
Username: postgres (or as specified in your .env file)
Password: postgres (or as specified in your .env file)
Database: postgres (or as specified in your .env file)
```

## API Endpoints

The API provides endpoints for user authentication, diet plans, meal tracking, and nutrition information.

To access protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN
```
