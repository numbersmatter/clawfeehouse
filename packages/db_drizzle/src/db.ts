import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export * from "./schema";
export { schema };

export function createDb(
  client: Parameters<typeof drizzle>[0],
) {
  return drizzle(client, { schema });
}

export type Db = ReturnType<typeof createDb>;

// export const createDb = (d1: D1Database) => {
//   return drizzle(d1);
// };
