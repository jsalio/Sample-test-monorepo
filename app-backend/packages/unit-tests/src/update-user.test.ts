import { IUserAccountRepository, IGenericRequest, UserWithoutPwd, IPasswordHasher, IResponse, User, UpdateUser } from "@app-monorepo/core";
import { describe, it, expect, beforeEach, jest } from "bun:test";

describe("UpdateUser Use Case", () => {
    let mockRepository: IUserAccountRepository;
    let mockRequest: IGenericRequest<any>;
    let existingUser: UserWithoutPwd;
    let mockPasswordHasher: IPasswordHasher;
    let updateData: any;

    // Setup common test data and mocks
    beforeEach(() => {
        // Initialize test data
        existingUser = {
            Id: "1",
            username: "existinguser",
            email: "existing@example.com",
            active: true,
            createdAt: new Date("2025-01-01"),
        };

        updateData = { id: "1", username: "updateduser", email: "updated@example.com" };

        // Setup repository mock
        mockRepository = {
            FindOne: jest.fn().mockResolvedValue({ success: true, data: { ...existingUser } }),
            update: jest.fn().mockResolvedValue({ success: true }),
            save: jest.fn(),
            Select: jest.fn(),
            Delete: jest.fn(),
            IndexOf: jest.fn().mockResolvedValue(false),
            getUserPassword: jest.fn(),
            updateUserPassword: jest.fn(),
        };

        // Setup password hasher mock
        mockPasswordHasher = {
            hash: jest.fn().mockResolvedValue("hashedpassword"),
            compare: jest.fn().mockResolvedValue(true),
        };

        // Setup request mock
        mockRequest = { build: () => updateData };
    });

    describe("Initialization", () => {
        it("should create instance successfully", () => {
            const updateUser = new UpdateUser(mockRequest, mockRepository, mockPasswordHasher);
            expect(updateUser).toBeInstanceOf(UpdateUser);
        });
    });

    describe("Request Validation", () => {
        it("should fail when user ID is missing", async () => {
            updateData = { ...updateData, id: undefined };
            const updateUser = new UpdateUser(mockRequest, mockRepository, mockPasswordHasher);
            const validations = await updateUser.validate();
            expect(validations).toContain("User ID is required for update");
        });

        it("should validate username format", async () => {
            updateData = { ...updateData, username: "invalid!@#" };

            mockRepository.IndexOf = jest.fn().mockResolvedValue(true);

            const updateUser = new UpdateUser(mockRequest, mockRepository, mockPasswordHasher);
            const validations = await updateUser.validate();
            expect(validations).toContain("Username should not contain special characters");
        });

        it("should validate email format", async () => {
            updateData = { ...updateData, email: "invalid-email" };

            mockRepository.IndexOf = jest.fn().mockResolvedValue(true);

            const updateUser = new UpdateUser(mockRequest, mockRepository, mockPasswordHasher);
            const validations = await updateUser.validate();
            expect(validations).toContain("Invalid email format");
        });
    });

    describe("Execution", () => {
        it("should update user successfully", async () => {
            const updateUser = new UpdateUser(mockRequest, mockRepository, mockPasswordHasher);
            const result = await updateUser.execute();
            
            expect(result.success).toBe(true);
            expect(mockRepository.update).toHaveBeenCalledWith(expect.objectContaining({
                username: "updateduser",
                email: "updated@example.com"
            }));
        });

        it("should handle user not found", async () => {
            mockRepository.FindOne = jest.fn().mockResolvedValue({ success: false, data: null });
            const updateUser = new UpdateUser(mockRequest, mockRepository, mockPasswordHasher);
            const result = await updateUser.execute();
            
            expect(result.success).toBe(false);
            expect(result.message).toBe("User not found");
        });
    });
});
