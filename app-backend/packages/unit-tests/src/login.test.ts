import { describe, it, expect, beforeEach } from "bun:test";
import { LoginUsers, IUserAccountRepository, IPasswordHasher, IGenericRequest, UserLogin, UserWithoutPwd } from "@app-monorepo/core";

describe("LoginUsers Use Case", () => {
  let mockRepository: IUserAccountRepository;
  let mockBuild: any;
  let mockRequest: IGenericRequest<UserLogin>;
  let validUser: UserWithoutPwd;
  let validLogin: UserLogin;
  let validPassword: string;
  let mockPasswordHasher: IPasswordHasher;

  // Setup common test data and mocks
  beforeEach(() => {
    // Initialize test data
    validUser = {
      Id: "1",
      username: "testuser",
      active: true,
      email: "test@example.com",
      createdAt: new Date("2025-06-06"),
    };

    validLogin = {
      username: "testuser",
      password: "123",
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
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);
      expect(loginUser).toBeInstanceOf(LoginUsers);
    });
  });

  describe("Request Validation", () => {
    it("should fail when request is null", async () => {
      // Arrange
      mockBuild = () => null;
      mockRequest = { build: mockBuild };
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Invalid request");
    });

    it("should fail when username is empty", async () => {
      // Arrange
      const login: UserLogin = { username: "", password: "123" };
      mockBuild = () => login;
      mockRequest = { build: mockBuild };
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Username is required");
    });

    it("should fail when username does not exist", async () => {
      // Arrange
      mockBuild = () => validLogin;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => false;
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Account does not exist");
    });

    it("should fail when username contains special characters", async () => {
      // Arrange
      mockBuild = () => ({ username: "testuser!", password: "123" });
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.getUserPassword = async () => validPassword;
      mockPasswordHasher.compare = async () => true;
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Username should not contain special characters");
    });

    it("should fail when username length is greater than 50", async () => {
      // Arrange
      const login: UserLogin = { username: "testuser".repeat(10), password: "123" };
      mockBuild = () => login;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.getUserPassword = async () => validPassword;
      mockPasswordHasher.compare = async () => true;
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Username must be less than 50 characters");
    });

    it("should fail when password is empty", async () => {
      // Arrange
      const login: UserLogin = { username: "testuser", password: "" };
      mockBuild = () => login;
      mockRequest = { build: mockBuild };
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Password is required");
    });

    it("should fail when password length is greater than 50", async () => {
      // Arrange
      const login: UserLogin = { username: "testuser", password: "123".repeat(20) };
      mockBuild = () => login;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.getUserPassword = async () => validPassword;
      mockPasswordHasher.compare = async () => true;
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Password must be less than 50 characters");
    });

    it("should fail when password is not set", async () => {
      // Arrange
      mockBuild = () => validLogin;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.getUserPassword = async () => null;
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Password not set");
    });

    it("should fail when stored password does not match user password", async () => {
      // Arrange
      mockBuild = () => validLogin;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.getUserPassword = async () => validPassword;
      mockPasswordHasher.compare = async () => false;
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(1);
      expect(validations).toContain("Invalid password");
    });

    it("should pass when all validations pass", async () => {
      // Arrange
      mockBuild = () => validLogin;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.getUserPassword = async () => validPassword;
      mockPasswordHasher.compare = async () => true;
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const validations = await loginUser.validate();

      // Assert
      expect(validations).toHaveLength(0);
    });
  });

  describe("Execute", () => {
    it("should handle execution failure", async () => {
      // Arrange
      const errorMessage = "Database error";
      mockBuild = () => validLogin;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.FindOne = async () => {
        throw new Error(errorMessage);
      };
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const result = await loginUser.execute();

      // Assert
      expect(result).toEqual({
        success: false,
        data: null,
        message: errorMessage,
      });
    });

    it("should execute successfully with valid credentials", async () => {
      // Arrange
      mockBuild = () => validLogin;
      mockRequest = { build: mockBuild };
      mockRepository.IndexOf = async () => true;
      mockRepository.FindOne = async () => ({message: "Login successful", success: true, data: { ...validUser, password: "123" } });
      const loginUser = new LoginUsers(mockRequest, mockRepository, mockPasswordHasher);

      // Act
      const result = await loginUser.execute();

      // Assert
      expect(result).toEqual({
        success: true,
        data: expect.objectContaining({
          Id: "1",
          username: "testuser",
          active: true,
          email: "test@example.com",
          createdAt: expect.any(Date),
        }),
        message: "Login successful",
      });
    //   expect(mockRepository.FindOne).toHaveBeenCalledWith("username", validLogin.username);
    });
  });
});