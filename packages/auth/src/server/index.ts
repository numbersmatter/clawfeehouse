export { createAuth, type AuthInstance } from "./auth";
export {
  getAdminUserIds,
  getOAuthProviderConfig,
  getTrustedOrigins,
  resolveAuthEnvironment,
  type AuthEnvironment,
} from "./env";
export { handleAuthRequest, isAuthRoute } from "./handler";
export {
  getSession,
  isAdminSession,
  requireAdminSession,
  type AuthSession,
} from "./session";
