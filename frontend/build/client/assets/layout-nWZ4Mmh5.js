import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { NavLink, Outlet, UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/admin/layout.tsx
var layout_default = UNSAFE_withComponentProps(function AdminLayout() {
	const { user, isAdmin } = useUserStore();
	if (!user || !isAdmin) return /* @__PURE__ */ jsxs("div", {
		className: "container mt-5 text-center",
		children: [
			/* @__PURE__ */ jsx("h2", { children: "Acceso Denegado" }),
			/* @__PURE__ */ jsx("p", { children: "No tienes permisos para ver esta página." }),
			/* @__PURE__ */ jsx(NavLink, {
				to: "/",
				className: "btn btn-primary mt-3",
				children: "Volver al Inicio"
			})
		]
	});
	return /* @__PURE__ */ jsx("div", {
		className: "container-fluid",
		children: /* @__PURE__ */ jsxs("div", {
			className: "row min-vh-100",
			children: [/* @__PURE__ */ jsx("nav", {
				className: "col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse p-0",
				children: /* @__PURE__ */ jsxs("div", {
					className: "position-sticky pt-3 text-white",
					children: [
						/* @__PURE__ */ jsx(NavLink, {
							to: "/",
							className: "d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-3",
							children: /* @__PURE__ */ jsx("span", {
								className: "fs-4 title-font",
								children: "Aparizzio Admin"
							})
						}),
						/* @__PURE__ */ jsx("hr", { className: "text-white" }),
						/* @__PURE__ */ jsxs("ul", {
							className: "nav nav-pills flex-column mb-auto",
							children: [
								/* @__PURE__ */ jsx("li", {
									className: "nav-item",
									children: /* @__PURE__ */ jsxs(NavLink, {
										to: "/admin/metrics",
										className: ({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? "active" : ""}`,
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-speedometer2 me-2" }), " Dashboard"]
									})
								}),
								/* @__PURE__ */ jsx("li", {
									className: "nav-item",
									children: /* @__PURE__ */ jsxs(NavLink, {
										to: "/admin/users",
										className: ({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? "active" : ""}`,
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-people-fill me-2" }), " Usuarios"]
									})
								}),
								/* @__PURE__ */ jsx("li", {
									className: "nav-item",
									children: /* @__PURE__ */ jsxs(NavLink, {
										to: "/admin/orders",
										className: ({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? "active" : ""}`,
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-cart-check me-2" }), " Pedidos"]
									})
								}),
								/* @__PURE__ */ jsx("li", {
									className: "nav-item",
									children: /* @__PURE__ */ jsxs(NavLink, {
										to: "/admin/categories",
										className: ({ isActive }) => `nav-link text-white rounded-0 px-3 ${isActive ? "active" : ""}`,
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-tags me-2" }), " Categorías y Productos"]
									})
								})
							]
						})
					]
				})
			}), /* @__PURE__ */ jsx("main", {
				className: "col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light py-4",
				style: { minHeight: "100vh" },
				children: /* @__PURE__ */ jsx(Outlet, {})
			})]
		})
	});
});
//#endregion
export { layout_default as default };
