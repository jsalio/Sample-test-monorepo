# Authentication Service

This service handles all authentication and authorization concerns for the application. It's part of the migration from a monolithic architecture to microservices.

## Service Responsibilities

- Token generation and validation
- User authentication
- Authorization middleware
- Session management

## Technical Details

### JWT Implementation

The service uses JSON Web Tokens (JWT) for authentication with the following configuration:

```typescript
Token Specifications:
- Algorithm: HS256
- Issuer: "app-monorepo"
- Audience: "users"
- Expiration: 1 hour
```

### Security Features

- Bearer token authentication
- Secure token verification
- Protected route middleware
- Token payload encryption

## API Endpoints

### Token Management
- `POST /auth/token` - Generate new JWT token
- `POST /auth/verify` - Verify token validity

### Authentication Flow

1. Client sends credentials
2. Service validates credentials
3. Service generates JWT token with user information
4. Token is returned to client
5. Client includes token in subsequent requests
6. Middleware validates token for protected routes

## Integration

### Request Authentication

To authenticate requests, include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Middleware Usage

The service provides two main middleware functions:

```typescript
// Token Verification
VerifyToken(req: Request): Promise<JWTPayload | null>

// Token Generation
GenerateToken(id: string, username: string): Promise<string>
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| SECRET_KEY | JWT signing key | "my-super-secret-key-1234567890" |

⚠️ **Important**: For production, always use a secure, environment-specific SECRET_KEY.

## Development

### Prerequisites
- Bun runtime
- Access to shared development environment

### Local Setup

1. Install dependencies:
```bash
bun install
```

2. Start the service:
```bash
bun start
```

### Testing

```bash
bun test
```

## Security Considerations

1. Token Management
   - Tokens expire after 1 hour
   - Include only necessary payload data
   - Use secure key storage

2. Best Practices
   - Always use HTTPS in production
   - Implement rate limiting
   - Monitor failed authentication attempts

## Error Handling

The service provides standardized error responses:

```json
{
  "error": "Unauthorized",
  "status": 401
}
```

## Future Improvements

- [ ] Implement refresh tokens
- [ ] Add rate limiting
- [ ] Enhanced logging
- [ ] Token revocation endpoint
- [ ] Role-based access control (RBAC)

## Contributing

1. Follow security best practices
2. Add tests for new features
3. Update documentation
4. Use conventional commits

For more details about the overall architecture, see the [backend documentation](../../README.md).
