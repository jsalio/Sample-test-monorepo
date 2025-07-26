import { IUserAccountRepository, UserWithoutPwd, GetAllUsers, IResponse } from "@app-monorepo/core";
import { describe, it, expect, beforeEach, jest } from "bun:test";

describe("GetAllUsers Use Case", () => {
    let mockRepository: IUserAccountRepository;
    let mockUsers: UserWithoutPwd[];

    // Setup common test data and mocks
    beforeEach(() => {
        // Initialize test data
        mockUsers = [
            {
                Id: "1",
                username: "user1",
                email: "user1@example.com",
                active: true,
                createdAt: new Date("2025-01-01"),
            },
            {
                Id: "2",
                username: "user2",
                email: "user2@example.com",
                active: true,
                createdAt: new Date("2025-01-02"),
            }
        ];

        // Setup repository mock
        mockRepository = {
            Select: jest.fn().mockResolvedValue({ 
                success: true, 
                data: [...mockUsers] 
            }),
            save: jest.fn(),
            update: jest.fn(),
            FindOne: jest.fn(),
            Delete: jest.fn(),
            IndexOf: jest.fn(),
            getUserPassword: jest.fn(),
        } as any; // Using type assertion to satisfy all interface requirements
    });

    describe("Initialization", () => {
        it("should create instance successfully", () => {
            const getAllUsers = new GetAllUsers(mockRepository);
            expect(getAllUsers).toBeInstanceOf(GetAllUsers);
        });
    });

    describe("Validation", () => {
        it("should always pass validation", async () => {
            const getAllUsers = new GetAllUsers(mockRepository);
            const validations = await getAllUsers.validate();
            expect(validations).toHaveLength(0);
        });
    });

    describe("Execution", () => {
        it("should get all users successfully", async () => {
            // Arrange
            const getAllUsers = new GetAllUsers(mockRepository);

            // Act
            const result = await getAllUsers.execute();
            
            // Assert
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockUsers);
            expect(mockRepository.Select).toHaveBeenCalledWith(undefined, undefined);
        });

        it("should handle empty user list", async () => {
            // Arrange
            mockRepository.Select = jest.fn().mockResolvedValue({ 
                success: true, 
                data: [] 
            });
            const getAllUsers = new GetAllUsers(mockRepository);

            // Act
            const result = await getAllUsers.execute();
            
            // Assert
            expect(result.success).toBe(true);
            expect(result.data).toEqual([]);
        });

        it("should handle repository errors", async () => {
            // Arrange
            const errorMessage = "Database error";
            mockRepository.Select = jest.fn().mockRejectedValue(new Error(errorMessage));
            const getAllUsers = new GetAllUsers(mockRepository);

            // Act
            const result = await getAllUsers.execute();
            
            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toContain(errorMessage);
            expect(result.data).toEqual([]);
        });

        it("should handle unsuccessful repository response", async () => {
            // Arrange
            const errorMessage = "Failed to fetch users";
            mockRepository.Select = jest.fn().mockResolvedValue({ 
                success: false, 
                message: errorMessage,
                data: []
            });
            const getAllUsers = new GetAllUsers(mockRepository);

            // Act
            const result = await getAllUsers.execute();
            
            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe(errorMessage);
            expect(result.data).toEqual([]);
        });
    });
});
