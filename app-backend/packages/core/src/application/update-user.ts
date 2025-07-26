
import { User } from "../domains/db/user";
import { IGenericRequest } from "../domains/IRequest";
import { IResponse } from "../domains/Response";
import { IPasswordHasher } from "../ports/adapters/IPasswordHasher";
import { IUserAccountRepository } from "../ports/repositories/IUserAccountRepository";
import { UserWithoutPwd } from "../domains/dto/userwithoutPwd";
import { UpdateUserValidator } from "../domains/validators/update-user.validator";
import { UpdateUserDto } from "../domains/dto/update-user";

/**
 * Use case for updating a user's information.
 * Validates the update user request and executes the user update operation.
 */
export class UpdateUser {
    /**
     * Initializes a new instance of the UpdateUser class.
     * @param request The update user request.
     * @param repository The user account repository.
     * @param passwordHasher The password hasher.
     */
    constructor(
        private readonly request: IGenericRequest<UpdateUserDto>,
        private readonly repository: IUserAccountRepository,
        private readonly passwordHasher: IPasswordHasher
    ) { }

    /**
     * Validates the update user request
     * @returns Array of validation error messages, empty if validation passes
     */
    public async validate(): Promise<string[]> {
        const validator = new UpdateUserValidator(this.repository, this.passwordHasher);
        const errors = await validator.validate(this.request.build());
        return errors.map(x => x.message);
    }

    /**
     * Executes the user update operation
     * @returns Response with the updated user data (without password)
     */
    public async execute(): Promise<IResponse<UserWithoutPwd>> {
        const updateData = this.request.build();

        try {
            // Get the existing user
            const existingUserResponse = await this.repository.FindOne("id", updateData.id);
            if (!existingUserResponse.success || !existingUserResponse.data) {
                return {
                    success: false,
                    data: null,
                    message: "User not found"
                };
            }

            const existingUser = existingUserResponse.data as UserWithoutPwd;

            // Prepare the updated user data
            const updatedUser: User = {
                id: updateData.id,
                username: updateData.username ?? existingUser.username,
                email: updateData.email ?? existingUser.email,
                createdAt: existingUser.createdAt,
                updatedAt: new Date(),
                role: "user",
                password: ""
            };

            // Save the updated user
            const updateResult = await this.repository.update(updatedUser);

            if (!updateResult.success) {
                return {
                    success: false,
                    data: null,
                    message: updateResult.message || "Failed to update user"
                };
            }

            // Return the updated user data without the password
            const { password, ...userWithoutPwd } = updatedUser;
            return {
                success: true,
                data: userWithoutPwd as unknown as UserWithoutPwd,
                message: "User updated successfully"
            };

        } catch (error) {
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : "An unexpected error occurred during user update"
            };
        }
    }
}
