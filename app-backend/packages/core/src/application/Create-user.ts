import { CreateAccount } from "../domains/dto/create-user";
import { User } from "../domains/db/user";
import { IGenericRequest } from "../domains/IRequest";
import { IResponse } from "../domains/Response";
import { CreateAccountValidator } from "../domains/validators/create-account.validator";
import { IPasswordHasher } from "../ports/adapters/IPasswordHasher";
import { IUserAccountRepository } from "../ports/repositories/IUserAccountRepository";
import { UserWithoutPwd } from "../domains/dto/userwithoutPwd";


/**
 * Use case for creating a new user account.
 * Validates the create user request and executes the user creation operation.
 */
export class  CreateUser {
    
    /**
     * Initializes a new instance of the CreateUser class.
     * @param IgenericRequest The create user request.
     * @param IUserAccountRepository The user account repository.
     * @param IPasswordHasher The password hasher.
     */
    constructor(
        private readonly IgenericRequest: IGenericRequest<CreateAccount>, 
        private readonly IUserAccountRepository: IUserAccountRepository, 
        private readonly IPasswordHasher: IPasswordHasher) {
        
    }

    /**
     * Validates the create user request.
     * @returns Array of validation errors, empty if validation passes
     */
    public async validate(): Promise<string[]> {
        const request = this.IgenericRequest.build();
        const validator = new CreateAccountValidator(this.IUserAccountRepository, this.IPasswordHasher);
        let errors = await validator.validate(request);
        return errors.map(x => x.message);
    }

    /**
     * Executes the user creation operation.
     * @returns Response object containing the created user data (without password)
     */
    public async execute(): Promise<IResponse<UserWithoutPwd>> {
        const request = this.IgenericRequest.build();
        try {
            const newUser: User = {
                id: "",
                username: request.username,
                password: request.password,
                email: request.email,
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const result = await this.IUserAccountRepository.save(newUser);
            return result;
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : "An unexpected error occurred during user creation"
            };
        }
       
    }
}