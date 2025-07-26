import { IResponse, IUserAccountRepository, User, UserWithoutPwd } from "@app-monorepo/core";
import Database from "bun:sqlite";

export class SqlLiteAccountRepo implements IUserAccountRepository {
    
    private db: Database;

    constructor(){
        this.db = new Database("app.db",{create:true});
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                email TEXT NOT NULL,
                role TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            )
        `); 
    }
    async getUserPassword(username: string): Promise<string | null> {
        const query = this.db.prepare("SELECT password FROM users WHERE username = ?");
        const result = query.get(username)as { password: string } | undefined;
        return result?.password || null;
    }
    async save(data: User): Promise<IResponse<UserWithoutPwd>> {
        const result = this.db.run("INSERT INTO users (id, username, password, email, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            data.id,
            data.username,
            data.password,
            data.email,
            data.role,
        ]);
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
        const result = this.db.run("UPDATE users SET username = ?, password = ?, email = ?, role = ?, createdAt = ?, updatedAt = ? WHERE id = ?", [
            data.username,
            data.password,
            data.email,
            data.role,
            data.id
        ]);
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
        const query = this.db.prepare(`SELECT * FROM users WHERE ${field} = ?`);
        const result = query.all(value as any) as User[];
        return {
            success: true,
            data: result.map(user => ({
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            } as UserWithoutPwd)),
            message: ""
        }
    }
    async FindOne(field: keyof User, value: string | Date): Promise<IResponse<UserWithoutPwd>> {
        const query = this.db.prepare(`SELECT * FROM users WHERE ${field} = ?`);
        const result = query.get(value as any) as User | undefined;
        return {
            success: true,
            data: {
                username: result?.username,
                email: result?.email,
                createdAt: result?.createdAt,
            } as UserWithoutPwd,
            message: ""
        }
    }
    async Delete(field: string): Promise<void> {
        const result = this.db.run("DELETE FROM users WHERE ? = ?", [field]);
    }
    async IndexOf(field: keyof User, value: string | Date): Promise<boolean> {
        const query = this.db.prepare(`SELECT ${field} FROM users WHERE ${field} = ?`);
        const result = query.get(value as any) as { [key: string]: string | number | bigint | boolean | null } | undefined;
        return result !== undefined;    
    }
}
