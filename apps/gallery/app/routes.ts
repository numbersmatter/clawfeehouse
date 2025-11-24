import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("view/:viewId", "routes/image_id.tsx"),
  ]),
  layout("routes/main_gallery.tsx", [
    route("test", "routes/gallery.tsx"),
  ]),
] satisfies RouteConfig;
