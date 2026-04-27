import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    // Public pages.
    route("/", "routes/home.tsx"),
    route("/menu", "routes/menu.tsx"),
    route("/product/:id", "routes/product.tsx"),
    route("/category/:id", "routes/category.tsx"),
    route("/cart", "routes/cart.tsx"),
    route("/checkout", "routes/checkout.tsx"),

    // Admin panel routes.
    route("/admin", "routes/admin/layout.tsx", [
        route("metrics", "routes/admin/metrics.tsx"),
        route("users", "routes/admin/users.tsx"),
        route("orders", "routes/admin/orders.tsx"),
        route("orders/:id", "routes/admin/order-details.tsx"),
        route("categories", "routes/admin/categories.tsx"),
        route("categories/:id/edit", "routes/admin/category-edit.tsx"),
        route("products/:id/edit", "routes/admin/product-edit.tsx"),
    ]),

    // User profile page.
    route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;