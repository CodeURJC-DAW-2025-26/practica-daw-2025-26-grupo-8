import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as useCartStore } from "./cart-store-Cz8axkd9.js";
import { t as logo_default } from "./logo-dqhES8Zi.js";
import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useLocation } from "react-router";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/components/Header.tsx
function Header() {
	const { isLogged, isAdmin, removeCurrentUser } = useUserStore();
	const { getTotalItems } = useCartStore();
	const totalItems = getTotalItems();
	return /* @__PURE__ */ jsx(Navbar, {
		expand: "lg",
		sticky: "top",
		className: "custom-navbar",
		children: /* @__PURE__ */ jsxs(Container, { children: [
			/* @__PURE__ */ jsxs(Navbar.Brand, {
				as: Link,
				to: "/",
				className: "logo",
				children: [/* @__PURE__ */ jsx("img", {
					src: logo_default,
					alt: "Logo"
				}), /* @__PURE__ */ jsx("span", { children: "Aparizzio" })]
			}),
			/* @__PURE__ */ jsx(Navbar.Toggle, {
				"aria-controls": "menuNavegacion",
				className: "border-0"
			}),
			/* @__PURE__ */ jsx(Navbar.Collapse, {
				id: "menuNavegacion",
				className: "justify-content-end",
				children: /* @__PURE__ */ jsxs(Nav, {
					className: "align-items-center gap-3",
					children: [
						/* @__PURE__ */ jsxs(Nav.Link, {
							as: NavLink,
							to: "/",
							className: "d-flex align-items-center",
							children: [/* @__PURE__ */ jsx("i", { className: "bi bi-house-door-fill me-2" }), " Inicio"]
						}),
						/* @__PURE__ */ jsxs(Nav.Link, {
							as: NavLink,
							to: "/menu",
							className: "d-flex align-items-center",
							children: [/* @__PURE__ */ jsx("i", { className: "bi bi-book-half me-2" }), " Ver Carta"]
						}),
						/* @__PURE__ */ jsxs(Nav.Link, {
							as: NavLink,
							to: "/cart",
							className: "cart-icon d-flex align-items-center position-relative",
							children: [
								/* @__PURE__ */ jsx("i", { className: "bi bi-cart3 fs-5 me-1" }),
								/* @__PURE__ */ jsx("span", { children: "Pedido" }),
								totalItems > 0 && /* @__PURE__ */ jsx("span", {
									className: "badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill",
									children: totalItems
								})
							]
						}),
						!isLogged && /* @__PURE__ */ jsx(Nav.Item, { children: /* @__PURE__ */ jsxs(Link, {
							to: "/?auth=login",
							className: "btn btn-primary btn-login d-flex align-items-center",
							children: [/* @__PURE__ */ jsx("i", { className: "bi bi-person-circle me-2" }), " Iniciar Sesión"]
						}) }),
						isLogged && /* @__PURE__ */ jsxs(Fragment, { children: [
							isAdmin && /* @__PURE__ */ jsxs(Nav.Link, {
								as: NavLink,
								to: "/admin/metrics",
								className: "d-flex align-items-center text-warning fw-bold",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-speedometer2 me-2" }), " Admin Panel"]
							}),
							/* @__PURE__ */ jsxs(Nav.Link, {
								as: NavLink,
								to: "/profile",
								className: "d-flex align-items-center",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-person-gear me-2" }), " Mi Perfil"]
							}),
							/* @__PURE__ */ jsx(Nav.Item, { children: /* @__PURE__ */ jsxs(Button, {
								variant: "outline-danger",
								onClick: removeCurrentUser,
								className: "d-flex align-items-center",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-box-arrow-right me-2" }), " Cerrar Sesión"]
							}) })
						] })
					]
				})
			})
		] })
	});
}
//#endregion
//#region app/components/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "footer-section mt-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "row g-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "col-md-4",
						children: [/* @__PURE__ */ jsx("h3", { children: "Aparizzio" }), /* @__PURE__ */ jsx("p", { children: "La mejor pizza de la ciudad desde 1990." })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "col-md-4",
						children: [
							/* @__PURE__ */ jsx("h3", { children: "Contacto" }),
							/* @__PURE__ */ jsx("p", {
								className: "mb-1",
								children: "Calle Falsa 123, Ciudad"
							}),
							/* @__PURE__ */ jsx("p", { children: "Tel: 555-0199" })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "col-md-4",
						children: [/* @__PURE__ */ jsx("h3", { children: "Redes Sociales" }), /* @__PURE__ */ jsx("p", { children: "Instagram | Facebook | Twitter" })]
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "copyright mt-5 pt-4 border-top border-secondary text-center",
				children: /* @__PURE__ */ jsx("p", { children: "© 2026 Aparizzio Pizzería. Todos los derechos reservados." })
			})]
		})
	});
}
//#endregion
//#region app/root.tsx
var links = () => [{
	rel: "stylesheet",
	href: "https://fonts.googleapis.com/css2?family=Lobster&family=Roboto:wght@400;500;700&display=swap"
}];
function Layout({ children }) {
	const isAdminRoute = useLocation().pathname.startsWith("/admin");
	return /* @__PURE__ */ jsxs("html", {
		lang: "es",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx("title", { children: "Pizzería Aparizzio (SPA)" }),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", {
			className: "d-flex flex-column min-vh-100",
			children: [
				!isAdminRoute && /* @__PURE__ */ jsx(Header, {}),
				/* @__PURE__ */ jsx("main", {
					className: "flex-grow-1",
					children
				}),
				!isAdminRoute && /* @__PURE__ */ jsx(Footer, {}),
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "¡Ups!";
	let details = "Ha ocurrido un error inesperado.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "Error 404" : "Error de Ruta";
		details = error.status === 404 ? "La página solicitada no se pudo encontrar." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "pt-5 p-4 container mx-auto text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-danger title-font",
				children: message
			}),
			/* @__PURE__ */ jsx("p", { children: details }),
			stack
		]
	});
});
//#endregion
export { ErrorBoundary, Layout, root_default as default, links };
