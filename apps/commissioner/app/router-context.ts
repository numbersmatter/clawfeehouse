import { createContext } from "react-router";

export interface AppSession {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

export const cloudflareContext = createContext<
  {
    env: Env;
    ctx: ExecutionContext;
  } | null
>(null);

export const sessionContext = createContext<AppSession | null>(null);