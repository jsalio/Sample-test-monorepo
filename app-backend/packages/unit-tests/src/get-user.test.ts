import { IUserAccountRepository, IGenericRequest, UserWithoutPwd, GetUser, IResponse } from "@app-monorepo/core";
import { describe, it, expect, beforeEach, jest } from "bun:test";

describe("GetUser Use Case", () => {
    let mockRepository: IUserAccountRepository;
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

        requestData = { id: "1" };

        // Setup repository mock
        mockRepository = {
            FindOne: jest.fn().mockResolvedValue({ 
                success: true, 
                data: { ...existingUser } 
            }),
            save: jest.fn(),
            update: jest.fn(),
            Select: jest.fn(),
            Delete: jest.fn(),
            IndexOf: jest.fn(),
            getUserPassword: jest.fn(),
            updateUserPassword: jest.fn(),
        };

        // Setup request mock
        mockRequest = { build: () => requestData };
    });

    describe("Initialization", () => {
        it("should create instance successfully", () => {
            const getUser = new GetUser(mockRequest, mockRepository);
            expect(getUser).toBeInstanceOf(GetUser);
        });
    });

    describe("Request Validation", () => {
        it("should fail when user ID is missing", async () => {
            // Arrange
            requestData = { id: undefined };
            const getUser = new GetUser(mockRequest, mockRepository);

            // Act
            const validations = await getUser.validate();

            // Assert
            expect(validations).toContain("User ID is required");
        });
    });

    describe("Execution", () => {
        it("should get user successfully", async () => {
            // Arrange
            const getUser = new GetUser(mockRequest, mockRepository);

            // Act
            const result = await getUser.execute();
            
            // Assert
            expect(result.success).toBe(true);
            expect(result.data).toEqual(existingUser);
            expect(mockRepository.FindOne).toHaveBeenCalledWith("id", "1");
        });

        it("should handle user not found", async () => {
            // Arrange
            mockRepository.FindOne = jest.fn().mockResolvedValue({ 
                success: false, 
                data: null 
            });
            const getUser = new GetUser(mockRequest, mockRepository);

            // Act
            const result = await getUser.execute();
            
            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe("User not found");
        });

        it("should handle repository errors", async () => {
            // Arrange
            const errorMessage = "Database error";
            mockRepository.FindOne = jest.fn().mockRejectedValue(new Error(errorMessage));
            const getUser = new GetUser(mockRequest, mockRepository);

            // Act
            const result = await getUser.execute();
            
            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toContain(errorMessage);
        });
    });
});
