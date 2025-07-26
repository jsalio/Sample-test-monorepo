import { IGenericRequest, IPasswordHasher, IUserAccountRepository, LoginUsers, UserLogin, UserWithoutPwd } from "@app-monorepo/core";
import { InMemoryAccountRepo, SqlLiteAccountRepo } from "@app-monorepo/db";
import { GenerateToken } from "../utils/middleware";


const mockPasswordHasher: IPasswordHasher = {
  async hash(password) {
    return password;
  },
  async compare(password, hashed) {
    return password === hashed;
  },
};

// Mock request para LoginUsers
const mockRequest: IGenericRequest<UserLogin> = {
  build() {
    return { username: "", password: "" }; // Se sobrescribe en los endpoints
  },
};
export const AuthController = (headers: Headers) => {
  const router: Map<string, (req: Request) => Promise<Response>> = new Map();
  const isTestEnv = process.env.NODE_ENV === "test";
  const repo: IUserAccountRepository = new InMemoryAccountRepo() //isTestEnv ? new InMemoryAccountRepo() : new SqlLiteAccountRepo();
  if (!isTestEnv) {
    (repo as IUserAccountRepository);
  }

  console.log("Is test env: " + isTestEnv);
  console.log("Repo: " + repo);
  router.set("/api/auth/login", async (req: Request) => {
    try {
      const body = await req.json();
      mockRequest.build = () => body;
      const loginUsers = new LoginUsers(mockRequest, repo, mockPasswordHasher);

      const validations = await loginUsers.validate();
      if (validations.length > 0) {
        return new Response(JSON.stringify({ error: validations }), {
          status: 400,
          headers: headers,
        });
      }
      const result = await loginUsers.execute();
      if (!result.success) {
        return new Response(JSON.stringify({ error: result.message }), {
          status: 400,
          headers: headers,
        });
      }

      if (result.data == null) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 400,
          headers: headers,
        });
      }

      const data = result.data as UserWithoutPwd;

      const token = await GenerateToken(data.Id, data.username);


      return new Response(JSON.stringify({ ...result, token }), {
        status: result.success ? 200 : 400,
        headers: headers,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as any).message }), {
        status: 400,
        headers: headers,
      });
    }
  });

  return router;
};