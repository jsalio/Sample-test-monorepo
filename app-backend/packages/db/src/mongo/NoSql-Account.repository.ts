import { IResponse, IUserAccountRepository, User, UserWithoutPwd } from "@app-monorepo/core";
import { Db, Collection, MongoClient } from "mongodb";

interface MongoUser {
    _id: string;
    username: string;
    password: string;
    active: boolean;
    email: string;
}

export class NoSqlAccountRepo implements IUserAccountRepository {

    private db: Db;
    private users: Collection<MongoUser>;

    constructor() {
        console.log(JSON.stringify(process.env, null, 2));
        console.log("Hello from NoSqlAccountRepo constructor");
        const client = new MongoClient(process.env.MongodbDB || "");

        client.connect().then(() => {
            console.log("Connected to MongoDB");
        }).catch((error) => {
            console.error("Error connecting to MongoDB:", error);
        });
        this.db = client.db("app_monorepo");    
        this.users = this.db.collection<MongoUser>("users");

        // Insertar datos de prueba si no existen
        this.users.findOne({ username: "test" }).then((existingUser) => {
            if (!existingUser) {
                this.users.insertOne({
                    _id: "1",
                    username: "test",
                    password: "test",
                    active: true,
                    email: "test@example.com",
                });
            }
        });
    }

    async getUserPassword(username: string): Promise<string | null> {
        const user = await this.users.findOne({ username });
        return user ? user.password : null;
    }
    async save(data: User): Promise<IResponse<UserWithoutPwd>> {
        const result = await this.users.insertOne({
            _id: data.id,
            username: data.username,
            password: data.password,
            active: true,
            email: data.email,
        });
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
        const result = await this.users.updateOne({ _id: data.id }, data);
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
        const targetField = field === "id" ? "_id" : field;
        const users = await this.users.find({ [targetField]: value }).toArray();
        return {
            success: true,
            data: users.map(user => ({
                username: user.username,
                email: user.email,
                createdAt: new Date(),
            } as UserWithoutPwd)),
            message: ""
        }
    }
    async FindOne(field: keyof User, value: string | Date): Promise<IResponse<UserWithoutPwd>> {
        const targetField = field === "id" ? "_id" : field;
        const user = await this.users.findOne({ [targetField]: value });  
        if (!user) {
            return {
                success: false,
                data: null,
                message: "User not found"
            }
        }
        return {
            success: true,
            data: {
                username: user.username,
                email: user.email,
                createdAt: new Date(),
            } as UserWithoutPwd,
            message: ""
        }
    }
    async Delete(field: string): Promise<void> {
        await this.users.deleteOne({ _id: field });
    }
    async IndexOf(field: keyof User, value: string | Date): Promise<boolean> {
        const targetField = field === "id" ? "_id" : field;
        const user = await this.users.findOne({ [targetField]: value });
        return user !== null;
    }

    async updateUserPassword(id: string, password: string): Promise<void> {
        await this.users.updateOne({ _id: id }, { $set: { password } });
    }
}