import { IGenericRequest } from "../domains/IRequest";
import { IResponse } from "../domains/Response";
import { IUserAccountRepository } from "../ports/repositories/IUserAccountRepository";
import { UserWithoutPwd } from "../domains/dto/userwithoutPwd";

/**
 * Use case for retrieving all users.
 * Handles the business logic for fetching all users' information.
 */
export class GetAllUsers {
    /**
     * Initializes a new instance of the GetAllUsers class.
     * @param repository The user account repository for data access.
     */
    constructor(
        private readonly repository: IUserAccountRepository
    ) {}

    /**
     * Validates the get all users request.
     * @returns Empty array as no validation is needed for this operation.
     */
    public async validate(): Promise<string[]> {
        // No validation needed for getting all users
        return [];
    }

    /**
     * Executes the get all users operation.
     * @returns Response with the list of all users (without passwords) or an error message.
     */
    public async execute(): Promise<IResponse<UserWithoutPwd[]>> {
        try {
            // Get all users using the repository's Select method
            // Passing undefined as field and value to get all records
            const result = await this.repository.Select(undefined as any, undefined as any);
            
            if (!result.success) {
                return {
                    success: false,
                    data: [],
                    message: result.message || "Failed to retrieve users"
                };
            }

            // The repository should already return UserWithoutPwd[]
            return {
                success: true,
                data: result.data || [],
                message: "Users retrieved successfully"
            };
            
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : "An unexpected error occurred while retrieving users"
            };
        }
    }
}
