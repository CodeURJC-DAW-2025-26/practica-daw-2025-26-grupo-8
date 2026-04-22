import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    // La ruta de inicio (que hicimos en la fase 4)
    route("/", "routes/home.tsx"),

    // NUEVA RUTA: La carta de pizzas
    route("/menu", "routes/menu.tsx"),

    // NUEVA RUTA: Detalle de producto
    route("/product/:id", "routes/product.tsx"),
] satisfies RouteConfig;