import { IPasswordHasher } from "../../ports/adapters/IPasswordHasher";
import { IUserAccountRepository } from "../../ports/repositories/IUserAccountRepository";
import { CreateAccount } from "../dto/create-user";
import { ValidationError } from "../ValidationError";

export class CreateAccountValidator {

    private readonly MAX_FIELD_LENGTH = 50;
    private readonly USERNAME_REGEX = /^[a-zA-Z0-9\s]+$/;
    private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    constructor(private readonly repository: IUserAccountRepository, private readonly passwordHasher: IPasswordHasher) { }

    private validateUsername(username: string): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!username?.trim()) {
            errors.push({ field: "username", message: "Username is required" });
        } else {
            if (username.length > this.MAX_FIELD_LENGTH) {
                errors.push({ field: "username", message: `Username must be less than ${this.MAX_FIELD_LENGTH} characters` });
            }
            if (!this.USERNAME_REGEX.test(username)) {
                errors.push({ field: "username", message: "Username should not contain special characters" });
            }
        }

        return errors;
    }

    private validatePassword(password: string): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!password?.trim()) {
            errors.push({ field: "password", message: "Password is required" });
        } else if (password.length > this.MAX_FIELD_LENGTH) {
            errors.push({ field: "password", message: `Password must be less than ${this.MAX_FIELD_LENGTH} characters` });
        }

        return errors;
    }

    private async validateEmail(email: string): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (!email?.trim()) {
            errors.push({ field: "email", message: "Email is required" });
        } else {
            if (!this.EMAIL_REGEX.test(email)) {
                errors.push({ field: "email", message: "Invalid email format" });
            }
        }

        const user = await this.repository.IndexOf("email", email);
        if (user) {
            errors.push({ field: "email", message: "Email already exists" });
        }

        return errors;
    }

    private async ValidateUserExists(username: string): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        const user = await this.repository.IndexOf("username", username);
        if (user) {
            errors.push({ field: "username", message: "Username already exists" });
        }

        return errors;
    }

    public async validate(account: CreateAccount): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];
        const request = account;

        if (request === null) {
            return [{ field: "Request", message: "Invalid request" }];
        }

        if (!request) {
            return [{ field: "Request", message: "Invalid request" }];
        }

        errors.push(...this.validateUsername(request.username));
        errors.push(...this.validatePassword(request.password));
        errors.push(...await this.validateEmail(request.email));
        errors.push(...await this.ValidateUserExists(request.username));

        return errors;
    }
}
