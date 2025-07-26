import { IPasswordHasher } from "../../ports/adapters/IPasswordHasher";
import { IUserAccountRepository } from "../../ports/repositories/IUserAccountRepository";
import { UpdateUserDto } from "../dto/update-user";
import { ValidationError } from "../ValidationError";

export class UpdateUserPasswordValidator {
 
    constructor(
        private readonly repository: IUserAccountRepository,
        private readonly passwordHasher: IPasswordHasher
    ) {}

    public async validate(request: UpdateUserDto): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (!request.id) {
            errors.push({
                field: "id",
                message: "User ID is required"
            });
        }

        if (!await this.repository.IndexOf("id", request.id)) {
            errors.push({
                field: "id",
                message: "User not found"
            });
        }

        return errors;
    }
}