import { CreateUser, GetAllUsers, GetUser, IGenericRequest, IPasswordHasher, IUserAccountRepository, UpdateUser, UpdateUserPassword } from "@app-monorepo/core";
import { InMemoryAccountRepo, NoSqlAccountRepo } from "@app-monorepo/db";
import { VerifyToken } from "./utils/middlerware";


const mockPasswordHasher: IPasswordHasher = {
  async hash(password: string) {
    return password;
  },
  async compare(password: string, hashed: string) {
    return password === hashed;
  }
};

const mockRequest: IGenericRequest<any> = {
  build() {
    return {};
  }
};

export const AccountController = (headers: Headers) => {
  const router: Map<string, (req: Request, params?: Record<string, string>) => Promise<Response>> = new Map();
  const isTestEnv = process.env.NODE_ENV === "test";
  const repo: IUserAccountRepository = isTestEnv ? new InMemoryAccountRepo() : new NoSqlAccountRepo();
  if (!isTestEnv) {
    (repo as NoSqlAccountRepo);
  }

  router.set("/api/account/new", async (req: Request) => {
    try {
      const body = await req.json();
      mockRequest.build = () => body;
      const saveUser = new CreateUser(mockRequest, repo, mockPasswordHasher);
      const validations = await saveUser.validate();
      if (validations.length > 0) {
        return new Response(JSON.stringify({ error: validations }), {
          status: 400,
          headers
        });
      }
      const result = await saveUser.execute();
      return new Response(JSON.stringify(result), {
        status: result.success ? 201 : 400,
        headers
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as any).message }), {
        status: 400,
        headers
      });
    }
  });

  router.set("/api/account/users", async (req: Request) => {
    const userId = await VerifyToken(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers
      });
    }
    try {
      const getAllUsers = new GetAllUsers(repo);
      const result = await getAllUsers.execute();
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as any).message }), {
        status: 400,
        headers
      });
    }
  });

  router.set("/api/account/user/:id", async (req: Request, params?: Record<string, string>) => {
    const userId = await VerifyToken(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers
      });
    }
    try {
      const id = params?.id;
      if (!id) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
          status: 400,
          headers
        });
      }
      mockRequest.build = () => ({ id });
      const getUser = new GetUser(mockRequest, repo);
      const result = await getUser.execute();
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as any).message }), {
        status: 400,
        headers
      });
    }
  });

  router.set("/api/account/update/:id", async (req: Request, params?: Record<string, string>) => {
    const userId = await VerifyToken(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers
      });
    }
    try {
      const id = params?.id;
      if (!id) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
          status: 400,
          headers
        });
      }
      const body = await req.json();
      mockRequest.build = () => ({ ...body, id });
      const updateUser = new UpdateUser(mockRequest, repo, mockPasswordHasher);
      const validations = await updateUser.validate();
      if (validations.length > 0) {
        return new Response(JSON.stringify({ error: validations }), {
          status: 400,
          headers
        });
      }
      const result = await updateUser.execute();
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as any).message }), {
        status: 400,
        headers
      });
    }
  });

  router.set("/api/account/update-password", async (req: Request) => {
    const userId = await VerifyToken(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers
      });
    }
    try {
      const body = await req.json();
      mockRequest.build = () => ({ ...body, id: userId });
      const updateUserPassword = new UpdateUserPassword(mockRequest, repo, mockPasswordHasher);
      const validations = await updateUserPassword.validate();
      if (validations.length > 0) {
        return new Response(JSON.stringify({ error: validations }), {
          status: 400,
          headers
        });
      }
      const result = await updateUserPassword.execute();
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
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