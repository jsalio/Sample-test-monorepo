# User Service

This service handles user account operations as part of our microservices architecture transition. It processes user-related requests through a message queue system (RabbitMQ) and manages user data in MongoDB.

## Service Responsibilities

- User account CRUD operations
- Message queue-based request handling
- Integration with MongoDB for data persistence
- Authentication validation

## Technical Details

### Message Queue Integration

The service processes requests through RabbitMQ queues:
```typescript
Queue Details:
- user-queue: Incoming requests
- user-response-queue: Service responses
- Connection: amqplib
```

### API Endpoints

#### Account Management
- `POST /api/account/new` - Create new user account
- `GET /api/account/users` - List all users
- `GET /api/account/users/:id` - Get user by ID
- `PUT /api/account/update/:id` - Update user
- `PATCH /api/account/update-password` - Update password

### Request/Response Examples

Create User Request:
```json
{
  "username": "john.doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

Success Response:
```json
{
  "id": "user123",
  "username": "john.doe",
  "email": "john.doe@example.com",
  "created_at": "2025-07-26T10:00:00Z"
}
```

## Integration with Auth Service

- Uses JWT tokens for request authentication
- Validates tokens through Auth Service
- Delegates password operations to Auth Service

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB connection string | Yes |
| PORT | Service port number | Yes |
| AUTH_SERVICE_URL | Auth service endpoint | Yes |

## Data Models

### User Schema
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

## Development

### Prerequisites
- Bun runtime
- MongoDB instance
- Access to Auth Service

### Local Setup

1. Install dependencies:
```bash
bun install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the service:
```bash
bun start
```

### Testing

```bash
bun test
```

## Error Handling

Standard error responses:
```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 'xyz' not found",
    "status": 404
  }
}
```

## Security Measures

1. Data Protection
   - Password hashing
   - Input validation
   - Data sanitization

2. Access Control
   - Role-based access
   - Request validation
   - Rate limiting

## Monitoring and Logging

- Request logging
- Error tracking
- Performance metrics
- Database operation logging

## Future Improvements

- [ ] Add user roles and permissions
- [ ] Implement user preferences
- [ ] Add activity logging
- [ ] Enhanced search capabilities
- [ ] Batch operations support

## Service Dependencies

- Auth Service (for authentication)
- MongoDB (for data persistence)
- Email Service (for notifications)

## Contributing

1. Follow coding standards
2. Include unit tests
3. Update documentation
4. Use conventional commits

## Performance Considerations

- Database indexing
- Response caching
- Pagination implementation
- Query optimization

For more details about the overall architecture, see the [backend documentation](../../README.md).
