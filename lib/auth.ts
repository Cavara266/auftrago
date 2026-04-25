export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: "admin" | "provider" | "user";
};

export async function requireUser(): Promise<AuthUser> {
  return {
    id: "demo-user",
    email: "info@cavara-hauswartung.ch",
    name: "Auftrago Admin",
    role: "admin",
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return {
    id: "demo-user",
    email: "info@cavara-hauswartung.ch",
    name: "Auftrago Admin",
    role: "admin",
  };
}