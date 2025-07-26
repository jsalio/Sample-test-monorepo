import { IUserAccountRepository } from "../../ports/repositories/IUserAccountRepository";
import { GetUserDto } from "../dto/get-user";
import { ValidationError } from "../ValidationError";

export class GetUserValidator {
 
    /**
     *
     */
    constructor(private readonly repository: IUserAccountRepository) {
        
    }

    public async validate(request: GetUserDto): Promise<ValidationError[]> {
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