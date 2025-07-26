import { JWTPayload, jwtVerify, SignJWT } from "jose";

const SECRET_KEY = new TextEncoder().encode("my-super-secret-key-1234567890");

export const VerifyToken = async (req: Request):Promise<JWTPayload | null> => {
  const authHeader = req.headers.get("Authorization");
  console.log("Auth header: " + authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  console.log("Token: " + token);
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      issuer: "app-monorepo",
      audience: "users",
    });
    console.log("Payload: " + JSON.stringify(payload));
    return payload; // Devuelve el subject (userId)
  } catch (error) {
    console.log("Error: " + error);
    return null;
  }
}

export const GenerateToken = async (id: string, username: string) => {
  const token = await new SignJWT({ sub: id, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("app-monorepo")
    .setAudience("users")
    .setExpirationTime("1h")
    .sign(SECRET_KEY);
  return token;
}