import { UpdateUserDto } from "../domains/dto/update-user";
import { UserWithoutPwd } from "../domains/dto/userwithoutPwd";
import { IGenericRequest } from "../domains/IRequest";
import { IResponse } from "../domains/Response";
import { UpdateUserPasswordValidator } from "../domains/validators/UpdateUserPassword.Validator";
import { IPasswordHasher } from "../ports/adapters/IPasswordHasher";
import { IUserAccountRepository } from "../ports/repositories/IUserAccountRepository";


export class UpdateUserPassword {
    
    constructor(
        private readonly request: IGenericRequest<UpdateUserDto>,
        private readonly repository: IUserAccountRepository,
        private readonly passwordHasher: IPasswordHasher
    ) { }

    public async validate(): Promise<string[]> {
        const validator = new UpdateUserPasswordValidator(this.repository, this.passwordHasher);
        const errors = await validator.validate(this.request.build());
        return errors.map(x => x.message);
    }

    public async execute():Promise<IResponse<UserWithoutPwd>>{
        const request = this.request.build();
        try {
            const pwd = await this.passwordHasher.hash(request.password as string);
            await this.repository.updateUserPassword(request.id, pwd);
            const user = await this.repository.FindOne("id", request.id);
            return user;
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : "An unexpected error occurred during user password update"
            };
        }
    }
}