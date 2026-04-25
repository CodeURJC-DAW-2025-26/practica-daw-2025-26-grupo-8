import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as useCartStore } from "./cart-store-Cz8axkd9.js";
import { n as useAuthModal, t as AuthModalProvider } from "./AuthModalContext-BVEB1Lx-.js";
import { t as authService } from "./auth-sevice-BIBssFFh.js";
import { t as logo_default } from "./logo-DKHlijU7.js";
import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useLocation, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Container, Modal, Nav, Navbar } from "react-bootstrap";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/components/Header.tsx
function Header() {
	const { isLogged, isAdmin, removeCurrentUser } = useUserStore();
	const { getTotalItems, clearCart } = useCartStore();
	const { openAuthModal } = useAuthModal();
	const totalItems = getTotalItems();
	const handleLogout = async () => {
		try {
			await authService.logout();
		} catch (error) {
			console.warn("No se pudo cerrar sesión en backend, limpiando sesión local igualmente", error);
		} finally {
			removeCurrentUser();
			clearCart();
		}
	};
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
						!isLogged && /* @__PURE__ */ jsx(Nav.Item, { children: /* @__PURE__ */ jsxs(Button, {
							variant: "primary",
							className: "btn-login d-flex align-items-center",
							onClick: () => openAuthModal("login"),
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
								onClick: handleLogout,
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
//#region app/assets/images/inicio-sesion_resized.jpg
var inicio_sesion_resized_default = "/new/assets/inicio-sesion_resized-DfzxC5nc.jpg";
//#endregion
//#region app/root.tsx
var links = () => [{
	rel: "stylesheet",
	href: "https://fonts.googleapis.com/css2?family=Lobster&family=Roboto:wght@400;500;700&display=swap"
}];
function AuthModal() {
	const { showAuthModal, authView, closeAuthModal, switchAuthView } = useAuthModal();
	const { setCurrentUser } = useUserStore();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [loginError, setLoginError] = useState(null);
	const [registerError, setRegisterError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loginForm, setLoginForm] = useState({
		username: "",
		password: ""
	});
	const [registerForm, setRegisterForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const passwordMismatch = useMemo(() => registerForm.confirmPassword.length > 0 && registerForm.password !== registerForm.confirmPassword, [registerForm.password, registerForm.confirmPassword]);
	useEffect(() => {
		const error = searchParams.get("error");
		const authRequired = searchParams.has("auth_required");
		const auth = searchParams.get("auth");
		if (!error && !authRequired && !auth) return;
		if (auth === "register") switchAuthView("register");
		else switchAuthView("login");
		if (error) setLoginError("Correo o contraseña incorrectos.");
		else if (authRequired) setLoginError("Tienes que iniciar sesión para acceder a esta página.");
		const cleanParams = new URLSearchParams(searchParams);
		cleanParams.delete("error");
		cleanParams.delete("auth_required");
		cleanParams.delete("auth");
		setSearchParams(cleanParams, { replace: true });
	}, [
		searchParams,
		setSearchParams,
		switchAuthView
	]);
	const handleLogin = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		setLoginError(null);
		try {
			const loginResponse = await authService.login(loginForm.username, loginForm.password);
			if (String(loginResponse?.status || "").toUpperCase() === "FAILURE") throw new Error(loginResponse?.error || "Credenciales inválidas");
			const me = await authService.getMe();
			setCurrentUser(me);
			closeAuthModal();
			setLoginForm({
				username: "",
				password: ""
			});
			if (me.roles?.includes("ADMIN")) navigate("/admin/metrics", { replace: true });
		} catch {
			setLoginError("Correo o contraseña incorrectos.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleRegister = async (event) => {
		event.preventDefault();
		setRegisterError(null);
		if (passwordMismatch) {
			setRegisterError("Las contraseñas no coinciden.");
			return;
		}
		setIsSubmitting(true);
		try {
			await authService.register(registerForm);
			switchAuthView("login");
			setLoginError("Registro completado. Ahora inicia sesión.");
			setRegisterForm({
				name: "",
				email: "",
				password: "",
				confirmPassword: ""
			});
		} catch (error) {
			setRegisterError(error instanceof Error ? error.message : "No se pudo completar el registro.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsx(Modal, {
		show: showAuthModal,
		onHide: closeAuthModal,
		centered: true,
		size: "lg",
		children: /* @__PURE__ */ jsx(Modal.Body, {
			className: "p-0",
			children: /* @__PURE__ */ jsxs("div", {
				className: "row g-0",
				children: [/* @__PURE__ */ jsx("div", {
					className: "col-md-5 d-none d-md-block",
					children: /* @__PURE__ */ jsx("img", {
						src: inicio_sesion_resized_default,
						alt: "Login",
						className: "img-fluid w-100 h-100",
						style: {
							objectFit: "cover",
							minHeight: "450px"
						}
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center",
					children: [authView === "login" && /* @__PURE__ */ jsxs("div", {
						className: "fade-in-left",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "fw-bold mb-4",
								children: "¡Hola de nuevo!"
							}),
							loginError && /* @__PURE__ */ jsx(Alert, {
								variant: "warning",
								className: "small py-2",
								children: loginError
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleLogin,
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ jsx("label", {
											className: "form-label small text-muted",
											children: "Correo"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											className: "form-control",
											required: true,
											value: loginForm.username,
											onChange: (e) => setLoginForm((prev) => ({
												...prev,
												username: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mb-4",
										children: [/* @__PURE__ */ jsx("label", {
											className: "form-label small text-muted",
											children: "Contraseña"
										}), /* @__PURE__ */ jsx("input", {
											type: "password",
											className: "form-control",
											required: true,
											value: loginForm.password,
											onChange: (e) => setLoginForm((prev) => ({
												...prev,
												password: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "d-grid mb-3",
										children: /* @__PURE__ */ jsx("button", {
											type: "submit",
											className: "btn btn-primary py-2",
											disabled: isSubmitting,
											children: isSubmitting ? "Entrando..." : "Entrar"
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-center",
										children: [/* @__PURE__ */ jsx("p", {
											className: "small text-muted mb-0",
											children: "¿No tienes cuenta?"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											className: "btn btn-link p-0 fw-bold text-decoration-none",
											onClick: () => switchAuthView("register"),
											children: "Regístrate aquí"
										})]
									})
								]
							})
						]
					}), authView === "register" && /* @__PURE__ */ jsxs("div", {
						className: "fade-in-right",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "fw-bold mb-4",
								children: "Crear Cuenta"
							}),
							registerError && /* @__PURE__ */ jsx(Alert, {
								variant: "danger",
								className: "small py-2",
								children: registerError
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleRegister,
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ jsx("label", {
											className: "form-label small text-muted",
											children: "Nombre Completo"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											className: "form-control",
											placeholder: "Ej: Juan Pérez",
											required: true,
											value: registerForm.name,
											onChange: (e) => setRegisterForm((prev) => ({
												...prev,
												name: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ jsx("label", {
											className: "form-label small text-muted",
											children: "Correo Electrónico"
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											className: "form-control",
											placeholder: "juan@ejemplo.com",
											required: true,
											value: registerForm.email,
											onChange: (e) => setRegisterForm((prev) => ({
												...prev,
												email: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ jsx("label", {
											className: "form-label small text-muted",
											children: "Contraseña"
										}), /* @__PURE__ */ jsx("input", {
											type: "password",
											className: "form-control",
											required: true,
											minLength: 4,
											value: registerForm.password,
											onChange: (e) => setRegisterForm((prev) => ({
												...prev,
												password: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mb-4",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "form-label small text-muted",
												children: "Repetir Contraseña"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "password",
												className: `form-control ${passwordMismatch ? "is-invalid" : ""}`,
												required: true,
												minLength: 4,
												value: registerForm.confirmPassword,
												onChange: (e) => setRegisterForm((prev) => ({
													...prev,
													confirmPassword: e.target.value
												}))
											}),
											/* @__PURE__ */ jsx("div", {
												className: "invalid-feedback",
												children: "Las contraseñas no coinciden."
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "d-grid mb-3",
										children: /* @__PURE__ */ jsx("button", {
											type: "submit",
											className: "btn btn-primary py-2",
											disabled: isSubmitting || passwordMismatch,
											children: isSubmitting ? "Registrando..." : "Registrarse"
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-center",
										children: [/* @__PURE__ */ jsx("p", {
											className: "small text-muted mb-0",
											children: "¿Ya tienes cuenta?"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											className: "btn btn-link p-0 fw-bold text-decoration-none",
											onClick: () => switchAuthView("login"),
											children: "Inicia sesión"
										})]
									})
								]
							})
						]
					})]
				})]
			})
		})
	});
}
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
				/* @__PURE__ */ jsxs(AuthModalProvider, { children: [
					!isAdminRoute && /* @__PURE__ */ jsx(Header, {}),
					/* @__PURE__ */ jsx("main", {
						className: "flex-grow-1",
						children
					}),
					/* @__PURE__ */ jsx(AuthModal, {}),
					!isAdminRoute && /* @__PURE__ */ jsx(Footer, {})
				] }),
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
