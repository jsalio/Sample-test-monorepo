import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("my-super-secret-key-1234567890");



// Simula el servidor para los tests
let server: any;

beforeAll(async () => {
    process.env.NODE_ENV = "test"; // Usar InMemoryAccountRepo
    server = await import("@app-monorepo/api");
});

afterAll(() => {
    // Bun no tiene una API nativa para cerrar el servidor, pero esto es suficiente para tests
});

describe("API Endpoints", () => {
    it("should login successfully via POST /login", async () => {
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "test", password: "test" }),
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toEqual(
            expect.objectContaining({
                Id: "1",
                username: "test",
                active: true,
            })
        );
    });

    it("should fail login with invalid credentials via POST /login", async () => {
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "nonexistent", password: "123" }),
        });
        const data = await response.json();
        expect(response.status).toBe(400);
        expect(data.error).toContain("Account does not exist");
    });

    it("should return 404 for unknown routes", async () => {
        const response = await fetch("http://localhost:3001/unknown");
        expect(response.status).toBe(404);
    });
});