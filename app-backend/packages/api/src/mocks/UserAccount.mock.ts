import { IResponse, IUserAccountRepository, User, UserWithoutPwd } from "@app-monorepo/core";

const users:User[]=[
    {
        id:"1",
        username:"test",
        password:"test",
        email:"test",
        role:"test",
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:"2",
        username:"test2",
        password:"test2",
        email:"test2",
        role:"test2",
        createdAt:new Date(),
        updatedAt:new Date()
    }
];

export class AccountMockRepo implements IUserAccountRepository {
    async getUserPassword(username: string): Promise<string | null> {
        return users.find(user=>user.username===username)?.password as string;
    }
    async save(data: User): Promise<IResponse<UserWithoutPwd>> {
        return {
            success: true,
            data: {
                Id: data.id,
                username: data.username,
                email: data.email,
                active: true,
                createdAt: data.createdAt
            },
            message: ""
        }
    }
    async update(data: User): Promise<IResponse<UserWithoutPwd>> {
        return {
            success: true,
            data: {
                Id: data.id,
                username: data.username,
                email: data.email,
                active: true,
                createdAt: data.createdAt
            },
            message: ""
        }
    }
    async Select(field: keyof User, value: string | Date): Promise<IResponse<UserWithoutPwd[]>> {
        return {
            success: true,
            data: users.map(user=>({
                Id: user.id,
                username: user.username,
                email: user.email,
                active: true,
                createdAt: user.createdAt
            })),
            message: ""
        }
    }
    async FindOne(field: keyof User, value: string | Date): Promise<IResponse<UserWithoutPwd>> {
        return {
            success: true,
            data:users.find(user=>user[field]===value)?{
                Id: users.find(user=>user[field]===value)?.id,
                username: users.find(user=>user[field]===value)?.username,
                email: users.find(user=>user[field]===value)?.email,
                active: true,
                createdAt: users.find(user=>user[field]===value)?.createdAt
            }:null as any,
            message: ""
        }
    }
    async Delete(field: string): Promise<void> {
        users.filter((user)=>(user as any)[field]!=="test") 
    }

    async IndexOf(field: keyof User, value: string | Date): Promise<boolean> {
       return users.some(user=>user[field]===value)
    }
}
