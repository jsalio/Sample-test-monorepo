import { IResponse, IUserAccountRepository, User, UserWithoutPwd } from "@app-monorepo/core";

export class InMemoryAccountRepo implements IUserAccountRepository {

    private users: User[] = [
        {
            id: "1",
            username: "test",
            password: "test", // En producción, esto estaría hasheado
            email: "test@example.com",
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ];

    async save(data: User): Promise<IResponse<UserWithoutPwd>> {
        return {
            success: true,
            data: {
                username: data.username,
                email: data.email,
                createdAt: data.createdAt,
            } as UserWithoutPwd,
            message: ""
        }
    }
    async update(data: User): Promise<IResponse<UserWithoutPwd>> {
        return {
            success: true,
            data: {
                username: data.username,
                email: data.email,
                createdAt: data.createdAt,
            } as UserWithoutPwd,
            message: ""
        }
    }
    async Select(field: keyof User, value: string | Date): Promise<IResponse<UserWithoutPwd[]>> {
        return {
            success: true,
            data: this.users.map(user => ({
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            } as UserWithoutPwd)),
            message: ""
        }
    }
    async FindOne(field: keyof User, value: string | Date): Promise<IResponse<UserWithoutPwd>> {
        let targetUser = this.users.find(user => user[field] === value);
        if (!targetUser) {
            return {
                success: false,
                data: null,
                message: "User not found"
            }
        }
        return {
            success: true,
            data: {
                Id: targetUser.id,
                username: targetUser.username,
                email: targetUser.email,
                createdAt: targetUser.createdAt,
                active: true,
            } as UserWithoutPwd,
            message: ""
        }
    }
    async Delete(field: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async IndexOf(field: keyof User, value: string | Date): Promise<boolean> {
        return this.users.some(user => user[field] === value);
    }

    async getUserPassword(username: string): Promise<string | null> {
        const user = this.users.find((user) => user.username === username);
        return user ? user.password : null;
    }

    async updateUserPassword(id: string, password: string): Promise<void> {
        const user = this.users.find((user) => user.id === id);
        if (!user) {
            throw new Error("User not found");
        }
        user.password = password;
    }
}