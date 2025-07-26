import { IPasswordHasher } from "../../ports/adapters/IPasswordHasher";
import { IUserAccountRepository } from "../../ports/repositories/IUserAccountRepository";
import { UpdateUserDto } from "../dto/update-user";

import { ValidationError } from "../ValidationError";

export class UpdateUserValidator {
    private readonly MAX_FIELD_LENGTH = 50;
    private readonly USERNAME_REGEX = /^[a-zA-Z0-9\s]+$/;
    private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(
        private readonly repository: IUserAccountRepository, 
        private readonly passwordHasher: IPasswordHasher
    ) {}

    private validateUsername(username?: string): ValidationError[] {
        const errors: ValidationError[] = [];

        if (username && username.trim()) {
            if (username.length > this.MAX_FIELD_LENGTH) {
                errors.push({ field: "username", message: `Username must be less than ${this.MAX_FIELD_LENGTH} characters` });
            }
            if (!this.USERNAME_REGEX.test(username)) {
                errors.push({ field: "username", message: "Username should not contain special characters" });
            }
        }

        return errors;
    }

    private validatePassword(password?: string): ValidationError[] {
        const errors: ValidationError[] = [];

        if (password && password.trim()) {
            if (password.length > this.MAX_FIELD_LENGTH) {
                errors.push({ field: "password", message: `Password must be less than ${this.MAX_FIELD_LENGTH} characters` });
            }
        }

        return errors;
    }

    private async validateEmail(email?: string, currentUserId?: string): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (email && email.trim()) {
            if (!this.EMAIL_REGEX.test(email)) {
                errors.push({ field: "email", message: "Invalid email format" });
            } else {
                const existingUser = await this.repository.IndexOf("email", email);
                if (existingUser) {
                    errors.push({ field: "email", message: "Email is already in use by another account" });
                }
            }
        }

        return errors;
    }

    private async validateUsernameExists(username?: string, currentUserId?: string): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (username && username.trim()) {
            const existingUser = await this.repository.IndexOf("username", username);
            if (existingUser) {
                errors.push({ field: "username", message: "Username is already taken" });
            }
        }

        return errors;
    }

    public async validate(updateData: UpdateUserDto): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (!updateData?.id) {
            return [{ field: "id", message: "User ID is required for update" }];
        }

        // Check if user exists
        const existingUser = await this.repository.IndexOf("id", updateData.id);
        if (!existingUser) {
            return [{ field: "id", message: "User not found" }];
        }

        // Only validate fields that are being updated
        errors.push(...this.validateUsername(updateData.username));
        errors.push(...this.validatePassword(updateData.password));
        errors.push(...await this.validateEmail(updateData.email, updateData.id));
        errors.push(...await this.validateUsernameExists(updateData.username, updateData.id));

        return errors;
    }
}
