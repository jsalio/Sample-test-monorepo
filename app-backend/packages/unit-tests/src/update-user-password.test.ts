import { IUserAccountRepository, IGenericRequest, UserWithoutPwd, IPasswordHasher, UpdateUserPassword, IResponse } from "@app-monorepo/core";
import { describe, it, expect, beforeEach, jest } from "bun:test";

describe("UpdateUserPassword Use Case", () => {
    let mockRepository: IUserAccountRepository;
    let mockPasswordHasher: IPasswordHasher;
    let mockRequest: IGenericRequest<any>;
    let existingUser: UserWithoutPwd;
    let requestData: any;

    // Setup common test data and mocks
    beforeEach(() => {
        // Initialize test data
        existingUser = {
            Id: "1",
            username: "testuser",
            email: "test@example.com",
            active: true,
            createdAt: new Date("2025-01-01"),
        };

        requestData = { 
            id: "1",
            password: "newSecurePassword123!"
        };

        // Setup repository mock
        mockRepository = {
            FindOne: jest.fn().mockResolvedValue({ 
                success: true, 
                data: { ...existingUser } 
            }),
            IndexOf: jest.fn().mockResolvedValue(true),
            updateUserPassword: jest.fn().mockResolvedValue(undefined),
            save: jest.fn(),
            update: jest.fn(),
            Select: jest.fn(),
            Delete: jest.fn(),
            getUserPassword: jest.fn(),
        } as any; // Using type assertion to satisfy all interface requirements

        // Setup password hasher mock
        mockPasswordHasher = {
            hash: jest.fn().mockResolvedValue("hashedPassword123"),
            compare: jest.fn().mockResolvedValue(true)
        };

        // Setup request mock
        mockRequest = { build: () => ({ ...requestData }) };
    });

    describe("Initialization", () => {
        it("should create instance successfully", () => {
            const updateUserPassword = new UpdateUserPassword(
                mockRequest,
                mockRepository,
                mockPasswordHasher
            );
            expect(updateUserPassword).toBeInstanceOf(UpdateUserPassword);
        });
    });

    describe("Validation", () => {
        it("should fail when user ID is missing", async () => {
            // Arrange
            requestData = { ...requestData, id: undefined };
            const updateUserPassword = new UpdateUserPassword(
                mockRequest,
                mockRepository,
                mockPasswordHasher
            );

            // Act
            const validations = await updateUserPassword.validate();

            // Assert
            expect(validations).toContain("User ID is required");
        });

        it("should fail when user does not exist", async () => {
            // Arrange
            mockRepository.IndexOf = jest.fn().mockResolvedValue(false);
            const updateUserPassword = new UpdateUserPassword(
                mockRequest,
                mockRepository,
                mockPasswordHasher
            );

            // Act
            const validations = await updateUserPassword.validate();

            // Assert
            expect(validations).toContain("User not found");
        });
    });

    describe("Execution", () => {
        it("should update user password successfully", async () => {
            // Arrange
            const updateUserPassword = new UpdateUserPassword(
                mockRequest,
                mockRepository,
                mockPasswordHasher
            );

            // Mock successful user retrieval after update
            mockRepository.FindOne = jest.fn().mockResolvedValue({
                success: true,
                data: { ...existingUser }
            });

            // Act
            const result = await updateUserPassword.execute();
            
            // Assert
            expect(result.success).toBe(true);
            expect(mockPasswordHasher.hash).toHaveBeenCalledWith(requestData.password);
            expect(mockRepository.updateUserPassword).toHaveBeenCalledWith(
                requestData.id,
                "hashedPassword123"
            );
            expect(mockRepository.FindOne).toHaveBeenCalledWith("id", requestData.id);
        });

        it("should handle repository errors during update", async () => {
            // Arrange
            const errorMessage = "Database error";
            mockRepository.updateUserPassword = jest.fn().mockRejectedValue(new Error(errorMessage));
            
            const updateUserPassword = new UpdateUserPassword(
                mockRequest,
                mockRepository,
                mockPasswordHasher
            );

            // Act
            const result = await updateUserPassword.execute();
            
            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toContain(errorMessage);
        });
    });
});
