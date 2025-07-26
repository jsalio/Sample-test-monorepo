import { IGenericRequest, IPasswordHasher, IUserAccountRepository, LoginUsers, UserLogin, UserWithoutPwd } from "@app-monorepo/core";
import { InMemoryAccountRepo, NoSqlAccountRepo } from "@app-monorepo/db";
import { GenerateToken } from "../utils/middleware";


const mockPasswordHasher: IPasswordHasher = {
  async hash(password) {
    return password;
  },
  async compare(password, hashed) {
    return password === hashed;
  }
};

const mockRequest: IGenericRequest<UserLogin> = {
  build() {
    return { username: "", password: "" };
  }
};

export const AuthController = (headers: Headers) => {
  const router: Map<string, (req: Request) => Promise<Response>> = new Map();
  const isTestEnv = process.env.NODE_ENV === "test";
  const repo: IUserAccountRepository = isTestEnv ? new InMemoryAccountRepo() : new NoSqlAccountRepo();
  if (!isTestEnv) {
    (repo as NoSqlAccountRepo);
  }

  router.set("/api/auth/login", async (req: Request) => {
    try {
      const body = await req.json();
      mockRequest.build = () => body;
      const loginUsers = new LoginUsers(mockRequest, repo, mockPasswordHasher);

      const validations = await loginUsers.validate();
      if (validations.length > 0) {
        return new Response(JSON.stringify({ error: validations }), {
          status: 400,
          headers
        });
      }
      const result = await loginUsers.execute();
      if (!result.success) {
        return new Response(JSON.stringify({ error: result.message }), {
          status: 400,
          headers
        });
      }

      if (result.data == null) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 400,
          headers
        });
      }

      const data = result.data as UserWithoutPwd;
      const token = await GenerateToken(data.Id, data.username);

      return new Response(JSON.stringify({ ...result, token }), {
        status: 200,
        headers
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as any).message }), {
        status: 400,
        headers
      });
    }
  });

  return router;
};