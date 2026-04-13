import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("callback", "routes/callback.tsx"),
  route("sign-out", "routes/sign-out.tsx"),
] satisfies RouteConfig;
