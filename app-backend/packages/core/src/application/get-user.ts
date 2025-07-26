import { IGenericRequest } from "../domains/IRequest";
import { IResponse } from "../domains/Response";
import { IUserAccountRepository } from "../ports/repositories/IUserAccountRepository";
import { GetUserDto } from "../domains/dto/get-user";
import { UserWithoutPwd } from "../domains/dto/userwithoutPwd";
import { GetUserValidator } from "../domains/validators/get-user.validator";

/**
 * Use case for retrieving a user by ID.
 * Handles the business logic for fetching a user's information.
 */
export class GetUser {
    /**
     * Initializes a new instance of the GetUser class.
     * @param request The get user request containing the user ID.
     * @param repository The user account repository for data access.
     */
    constructor(
        private readonly request: IGenericRequest<GetUserDto>,
        private readonly repository: IUserAccountRepository
    ) {}

    /**
     * Validates the get user request.
     * @returns Array of validation error messages, empty if validation passes.
     */
    public async validate(): Promise<string[]> {
        const validator = new GetUserValidator(this.repository);
        const errors = await validator.validate(this.request.build());
        return errors.map(x => x.message);
    }

    /**
     * Executes the get user operation.
     * @returns Response with the user data (without password) or an error message.
     */
    public async execute(): Promise<IResponse<UserWithoutPwd>> {
        const request = this.request.build();
        
        try {
            // Get user by ID
            const result = await this.repository.FindOne("id", request.id);
            
            if (!result.success || !result.data) {
                return {
                    success: false,
                    data: null,
                    message: "User not found"
                };
            }

            // Return user data (already mapped to UserWithoutPwd by the repository)
            return {
                success: true,
                data: result.data,
                message: "User retrieved successfully"
            };
            
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : "An unexpected error occurred while retrieving user"
            };
        }
    }
}
