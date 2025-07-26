import { IUserAccountRepository, IGenericRequest, UserWithoutPwd, IPasswordHasher, CreateAccount, CreateUser, IResponse } from "@app-monorepo/core";
import { describe, it, expect, beforeEach } from "bun:test";

describe("CreateUser Use Case", () => {
    let mockRepository: IUserAccountRepository;
    let mockBuild: any;
    let mockRequest: IGenericRequest<CreateAccount>;
    let validUser: UserWithoutPwd;
    let validNewAccount: CreateAccount;
    let validPassword: string;
    let mockPasswordHasher: IPasswordHasher;

    // Setup common test data and mocks
    beforeEach(() => {
        // Initialize test data
        validUser = {
            Id: "1",
            username: "testuser1",
            active: true,
            email: "test1@example.com",
            createdAt: new Date("2025-06-06"),
        };

        validNewAccount = {
            username: "testuser1",
            password: "123",
            email: "test1@example.com",
            active: true,
        };

        validPassword = "123";

        // Setup repository mock
        mockRepository = {
            save: async () => ({} as any),
            update: async () => ({} as any),
            Select: async () => ({} as any),
            FindOne: async () => ({} as any),
            Delete: async () => ({} as any),
            IndexOf: async () => false,
            getUserPassword: async () => null,
        };

        // Setup password hasher mock
        mockPasswordHasher = {
            hash: async () => "",
            compare: async () => false,
        };

        // Setup request mock
        mockBuild = async () => null;
        mockRequest = { build: mockBuild };
    });

    describe("Initialization", () => {
        it("should create instance successfully", () => {
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);
            expect(createUser).toBeInstanceOf(CreateUser);
        });
    });

    describe("Request Validation", () => {
        it("should fail when request is null", async () => {
            // Arrange
            mockBuild = () => null;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Invalid request");
        });
        it("should fail when username is empty", async () => {
            // Arrange
            const account: CreateAccount = { username: "", password: "123", email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Username is required");
        });
        it("when user name is to long should fail", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser1".repeat(10), password: "123", email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Username must be less than 50 characters");
        })
        it("When username contains special characters should fail", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser1!@#", password: "123", email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Username should not contain special characters");
        });
        it("When username already exists should fail", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser1", password: "123", email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            mockRepository.IndexOf = async (field: string, value: string) => {
                if (field === "username" && value === "testuser1") {
                    return true;
                }
                return false;
            }

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Username already exists");
        });
        it("should fail when password is empty", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser1", password: "", email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Password is required");
        });
        it("when password is to long should fail", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser1", password: "123".repeat(20), email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Password must be less than 50 characters");
        });
        it("when email is empty should fail", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser1", password: "123", email: "", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Email is required");
        });
        it("When email have incorrect format should fail", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser1", password: "123", email: "test1@example", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            // Act
            const validations: string[] = await createUser.validate();

            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Invalid email format");
        });

        it("When email already exists should fail", async () => {
            // Arrange
            const account: CreateAccount = { username: "testuser33", password: "123", email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            mockRepository.IndexOf = async (field: string, value: string) => {
                if (field === "email" && value === "test1@example.com") {
                    return true;
                }
                return false;
            }

            // Act
            const validations: string[] = await createUser.validate();
            // Assert
            expect(validations).toHaveLength(1);
            expect(validations).toContain("Email already exists");
        });

        it("When all validation pass should success",async()=>{
            // Arrange
            const account: CreateAccount = { username: "testuser1", password: "123", email: "test1@example.com", active: true };
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            mockRepository.IndexOf = async () => false;

            // Act
            const validations: string[] = await createUser.validate();
            // Assert
            expect(validations).toHaveLength(0);
        })
    });

    describe("Execute Validation",()=>{
        it("should handle execution failure", async () => {
            // Arrange
            const errorMessage = "Database error";
            const account: CreateAccount = validNewAccount;
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            mockRepository.IndexOf = async () => false;
            mockRepository.save = async()=>{
                throw new Error(errorMessage);
            }

            // Act
            const result: IResponse<UserWithoutPwd> = await createUser.execute();
            // Assert
            expect(result.success).toBe(false);
            expect(result.message).toBe(errorMessage);
        });
        it("should handle execution success", async () => {
            // Arrange
            const account: CreateAccount = validNewAccount;
            mockBuild = () => account;
            mockRequest = { build: mockBuild };
            const createUser = new CreateUser(mockRequest, mockRepository, mockPasswordHasher);

            mockRepository.IndexOf = async () => false;
            mockRepository.save = async()=>{
                return {
                    success: true,
                    data: validUser,
                    message: "User created successfully"
                };
            }

            // Act
            const result: IResponse<UserWithoutPwd> = await createUser.execute();
            // Assert
            expect(result.success).toBe(true);
            expect(result.message).toBe("User created successfully");
        });
    });
});
