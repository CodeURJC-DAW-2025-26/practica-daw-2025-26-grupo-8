import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    // La ruta de inicio (que hicimos en la fase 4)
    route("/", "routes/home.tsx"),

    // NUEVA RUTA: La carta de pizzas
    route("/menu", "routes/menu.tsx"),

    // NUEVA RUTA: Detalle de producto
    route("/product/:id", "routes/product.tsx"),

    // NUEVA RUTA: Detalle de categoría (con paginación)
    route("/category/:id", "routes/category.tsx"),

    // NUEVA RUTA: Carrito de compras
    route("/cart", "routes/cart.tsx"),

    // NUEVA RUTA: Checkout (finalizar compra)
    route("/checkout", "routes/checkout.tsx"),

    // --- PANEL DE ADMINISTRACIÓN ---
    route("/admin", "routes/admin/layout.tsx", [
        route("metrics", "routes/admin/metrics.tsx"),
        route("users", "routes/admin/users.tsx"),
        route("orders", "routes/admin/orders.tsx"),
        route("orders/:id", "routes/admin/order-details.tsx"),
        route("categories", "routes/admin/categories.tsx"),
        route("categories/:id/edit", "routes/admin/category-edit.tsx"),
        route("products/:id/edit", "routes/admin/product-edit.tsx"),
    ]),

    route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;