import { UserLogin } from "../domains/dto/Login";
import { UserWithoutPwd } from "../domains/dto/userwithoutPwd";
import { IGenericRequest } from "../domains/IRequest";
import { IResponse } from "../domains/Response";
import { LoginValidator } from "../domains/validators/login.validator";
import { IPasswordHasher } from "../ports/adapters/IPasswordHasher";
import { IUserAccountRepository } from "../ports/repositories/IUserAccountRepository";

/**
 * Handles user login operations including validation and authentication.
 */
export class LoginUsers {
    constructor(
      private readonly request: IGenericRequest<UserLogin>,
      private readonly repository: IUserAccountRepository,
      private readonly passwordHasher: IPasswordHasher
    ) {}
  
    /**
     * Validates the login request credentials.
     * @returns Array of validation errors, empty if validation passes
     */
    public async validate(): Promise<string[]> {
      let validator = new LoginValidator(this.repository, this.passwordHasher);
      let errors = await validator.validate(this.request.build());
      return errors.map(x => x.message);
    }
  
    /**
     * Executes the login process and returns user data.
     * @returns Response object containing login result
     */
    public async execute(): Promise<IResponse<UserWithoutPwd>> {
      const request = this.request.build();
      try {
        const result = await this.repository.FindOne("username", request.username);
        const data = result.data as UserWithoutPwd;
  
        return {
          success: true,
          data: {
            Id: data.Id,
            username: data.username,
            email: data.email,
            active: data.active,
            createdAt: data.createdAt
          },
          message: "Login successful"
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          message: error instanceof Error ? error.message : "An unexpected error occurred during login"
        };
      }
    }
  }