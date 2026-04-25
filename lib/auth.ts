export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role: "admin" | "provider" | "user";
  credits: number;
};

export type Session = {
  user: AuthUser;
};

const demoUser: AuthUser = {
  id: "demo-user",
  email: "info@cavara-hauswartung.ch",
  name: "Auftrago Admin",
  role: "admin",
  credits: 999,
};

export async function requireUser(): Promise<AuthUser> {
  return demoUser;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return demoUser;
}

export async function getSession(): Promise<Session | null> {
  return {
    user: demoUser,
  };
}

export async function createSession(user: AuthUser): Promise<Session> {
  return {
    user: {
      ...user,
      credits: user.credits ?? 999,
    },
  };
}

export async function clearSession(): Promise<void> {
  return;
}

export async function clearSessionUser(): Promise<void> {
  return;
}

export async function setSessionUser(user: AuthUser): Promise<Session> {
  return {
    user: {
      ...user,
      credits: user.credits ?? 999,
    },
  };
}