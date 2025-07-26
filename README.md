# Full Stack Monorepo Application

This is a modern full-stack monorepo application that demonstrates a clean architecture approach using Bun and TypeScript. The project consists of a frontend built with Angular and a backend using Hexagonal Architecture.

## Project Structure

```
├── app-backend/      # Backend application with Hexagonal Architecture
│   └── packages/
│       ├── api/     # REST API endpoints
│       ├── core/    # Business logic & domain
│       └── db/      # Database implementations
│
└── app-frontend/    # Angular frontend application
    └── src/
        ├── app/
        │   ├── modules/
        │   │   ├── login/    # Login module
        │   │   └── site/     # Main site module
        │   └── services/     # Angular services
        └── ...
```

## Applications

### Backend

The backend is built using a Hexagonal Architecture approach that ensures clean separation of concerns and high maintainability. It provides a REST API for user management and authentication.

[📚 View Backend Documentation](app-backend/README.md)

Key Features:
- Clean Hexagonal Architecture
- Easy to swap implementations (e.g., database providers)
- Comprehensive testing setup
- Built with Bun and TypeScript

### Frontend

The frontend is an Angular application that provides:
- User authentication
- User management interface
- Responsive design
- Module-based architecture

## Getting Started

1. Install Dependencies:
   ```bash
   # Install backend dependencies
   cd app-backend
   bun install

   # Install frontend dependencies
   cd ../app-frontend
   npm install
   ```

2. Start the Applications:
   ```bash
   # Start backend (from app-backend directory)
   bun start

   # Start frontend (from app-frontend directory)
   ng serve
   ```

## Development

The project uses:
- Bun as the backend runtime and package manager
- Angular CLI for frontend development
- TypeScript throughout the entire stack
- Jest for testing

## Testing

```bash
# Run backend tests
cd app-backend
bun test

# Run frontend tests
cd app-frontend
ng test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
