type LocalUser = { id: string; name: string; email: string; passwordHash: string; role: "USER" };

type GlobalWithAuthStore = typeof globalThis & {
  __flowosFallbackUsers?: Map<string, LocalUser>;
};

const globalStore = globalThis as GlobalWithAuthStore;

if (!globalStore.__flowosFallbackUsers) {
  globalStore.__flowosFallbackUsers = new Map<string, LocalUser>();
}

export const fallbackUsers = globalStore.__flowosFallbackUsers;

export function createFallbackUser(input: { name: string; email: string; passwordHash: string }): LocalUser {
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user: LocalUser = { id, name: input.name, email: input.email, passwordHash: input.passwordHash, role: "USER" };
  fallbackUsers.set(user.email, user);
  return user;
}
