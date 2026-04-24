import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as logo_default } from "./logo-dqhES8Zi.js";
import { t as categoryService } from "./category-service-DucSZTVQ.js";
import { t as productService } from "./product-service-BkwnfBmn.js";
import { t as authService } from "./auth-sevice-Iq6779Ns.js";
import { Link, UNSAFE_withComponentProps, useLoaderData, useNavigate, useSearchParams } from "react-router";
import { Alert, Modal } from "react-bootstrap";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
//#region app/assets/images/inicio-sesion_resized.jpg
var inicio_sesion_resized_default = "/new/assets/inicio-sesion_resized-DfzxC5nc.jpg";
//#endregion
//#region app/routes/home.tsx
var LIMIT = 5;
function normalize(value) {
	return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function resolveCategoryKey(product) {
	const category = normalize(product.categoryTitle || "");
	if (category.includes("pizza")) return "PIZZA";
	if (category.includes("aperitivo") || category.includes("entrante")) return "STARTER";
	if (category.includes("bebida")) return "DRINK";
	return "OTHER";
}
function distinctFromLatestOrder(order, catalogByTitle) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const title of order.productTitles || []) {
		const mapped = catalogByTitle.get(normalize(title));
		if (!mapped || seen.has(mapped.id)) continue;
		seen.add(mapped.id);
		result.push(mapped);
	}
	return result;
}
function countPoints(orders, catalogByTitle) {
	const points = /* @__PURE__ */ new Map();
	for (const order of orders) for (const title of order.productTitles || []) {
		const mapped = catalogByTitle.get(normalize(title));
		if (!mapped) continue;
		points.set(mapped.id, (points.get(mapped.id) ?? 0) + 1);
	}
	return points;
}
function fillPriority(latestProducts) {
	const hasPizza = latestProducts.some((p) => resolveCategoryKey(p) === "PIZZA");
	const hasStarter = latestProducts.some((p) => resolveCategoryKey(p) === "STARTER");
	const hasDrink = latestProducts.some((p) => resolveCategoryKey(p) === "DRINK");
	const priority = [];
	if (hasPizza) priority.push("PIZZA", "STARTER", "DRINK");
	else if (hasStarter) priority.push("STARTER", "PIZZA", "DRINK");
	else if (hasDrink) priority.push("DRINK", "PIZZA", "STARTER");
	priority.push("OTHER");
	return priority;
}
function buildRecommendations(orders, catalog) {
	if (!orders.length || !catalog.length) return [];
	const latestOrder = [...orders].sort((a, b) => a.id - b.id).at(-1);
	if (!latestOrder) return [];
	const catalogByTitle = new Map(catalog.map((p) => [normalize(p.title), p]));
	const userPoints = countPoints(orders, catalogByTitle);
	const latestPoints = countPoints([latestOrder], catalogByTitle);
	const latestDistinct = distinctFromLatestOrder(latestOrder, catalogByTitle);
	if (!latestDistinct.length) return [];
	const rankedLatest = [...latestDistinct].sort((a, b) => {
		const latestDiff = (latestPoints.get(b.id) ?? 0) - (latestPoints.get(a.id) ?? 0);
		if (latestDiff !== 0) return latestDiff;
		const userDiff = (userPoints.get(b.id) ?? 0) - (userPoints.get(a.id) ?? 0);
		if (userDiff !== 0) return userDiff;
		return b.id - a.id;
	});
	if (rankedLatest.length >= LIMIT) return rankedLatest.slice(0, LIMIT);
	const recommendations = [...rankedLatest];
	const existing = new Set(recommendations.map((p) => p.id));
	const historyRanked = [...catalog].filter((p) => !existing.has(p.id)).sort((a, b) => {
		const pointsDiff = (userPoints.get(b.id) ?? 0) - (userPoints.get(a.id) ?? 0);
		if (pointsDiff !== 0) return pointsDiff;
		return b.id - a.id;
	});
	for (const key of fillPriority(latestDistinct)) {
		for (const product of historyRanked) {
			if (recommendations.length >= LIMIT) break;
			if (existing.has(product.id) || resolveCategoryKey(product) !== key) continue;
			recommendations.push(product);
			existing.add(product.id);
		}
		if (recommendations.length >= LIMIT) break;
	}
	for (const product of historyRanked) {
		if (recommendations.length >= LIMIT) break;
		if (existing.has(product.id)) continue;
		recommendations.push(product);
		existing.add(product.id);
	}
	return recommendations.slice(0, LIMIT);
}
async function loadTopProducts() {
	try {
		const metricsResponse = await fetch("/api/v1/metrics/");
		if (metricsResponse.ok) {
			const ids = ((await metricsResponse.json()).topSoldProducts || []).map((p) => p.productId).slice(0, LIMIT);
			if (ids.length > 0) return (await Promise.all(ids.map(async (id) => {
				try {
					return await productService.getProductById(id);
				} catch {
					return null;
				}
			}))).filter((p) => p !== null);
			return [];
		}
	} catch {
		return [];
	}
	return [];
}
/**
* CLIENT LOADER: Obligatorio por rúbrica (Punto 21).
* Carga los datos ANTES de que el usuario vea la página.
*/
async function clientLoader() {
	const [categories, topProducts] = await Promise.all([categoryService.getCategories(), loadTopProducts()]);
	return {
		categories,
		topProducts
	};
}
var home_default = UNSAFE_withComponentProps(function Home() {
	const { categories, topProducts } = useLoaderData();
	const { user, isAdmin, setCurrentUser } = useUserStore();
	const [personalizedProducts, setPersonalizedProducts] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authView, setAuthView] = useState("login");
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
		let cancelled = false;
		async function loadPersonalized() {
			if (!user || isAdmin) {
				if (!cancelled) setPersonalizedProducts([]);
				return;
			}
			try {
				const [orders, catalog] = await Promise.all([authService.getMyOrders(), productService.getProducts(0, 1e3)]);
				if (!cancelled) setPersonalizedProducts(buildRecommendations(orders, catalog.content));
			} catch {
				if (!cancelled) setPersonalizedProducts([]);
			}
		}
		loadPersonalized();
		return () => {
			cancelled = true;
		};
	}, [user?.id, isAdmin]);
	useEffect(() => {
		const error = searchParams.get("error");
		const authRequired = searchParams.has("auth_required");
		const auth = searchParams.get("auth");
		if (!error && !authRequired && !auth) return;
		if (auth === "register") setAuthView("register");
		else setAuthView("login");
		if (error) setLoginError("Correo o contraseña incorrectos.");
		else if (authRequired) setLoginError("Tienes que iniciar sesión para acceder a esta página.");
		setShowAuthModal(true);
		const cleanParams = new URLSearchParams(searchParams);
		cleanParams.delete("error");
		cleanParams.delete("auth_required");
		cleanParams.delete("auth");
		setSearchParams(cleanParams, { replace: true });
	}, [searchParams, setSearchParams]);
	const switchAuthView = (next) => {
		setAuthView(next);
		setLoginError(null);
		setRegisterError(null);
	};
	const closeAuthModal = () => {
		setShowAuthModal(false);
		setLoginError(null);
		setRegisterError(null);
	};
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
			if (me.roles?.includes("ADMIN")) navigate("/admin/metrics", { replace: true });
			else navigate("/", { replace: true });
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("header", {
			className: "hero-section d-flex align-items-center justify-content-center text-center",
			children: /* @__PURE__ */ jsxs("div", {
				className: "container text-white",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "display-3 mb-2",
						children: "La auténtica pizza italiana"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "lead mb-4",
						children: "Ingredientes frescos, horno de leña y mucho amor."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/menu",
						className: "btn btn-primary btn-cta",
						children: "Pedir Ahora"
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "section-padding container",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "section-title text-center",
				children: "!! Los 5 Más Vendidos !!"
			}), /* @__PURE__ */ jsx("div", {
				className: "row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4 justify-content-center",
				children: topProducts.map((product) => /* @__PURE__ */ jsx("div", {
					className: "col",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card product-card h-100",
						children: [/* @__PURE__ */ jsx(Link, {
							to: `/product/${product.id}`,
							children: /* @__PURE__ */ jsx("img", {
								src: product.hasImage ? `/api/v1/products/${product.id}/image` : logo_default,
								className: "card-img-top",
								alt: product.title
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "card-title h5",
									children: product.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "card-text text-muted small",
									children: product.shortDescription
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "price",
									children: [product.price, "€"]
								})
							]
						})]
					})
				}, product.id))
			})]
		}),
		personalizedProducts.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "container",
			children: /* @__PURE__ */ jsx("hr", {
				className: "text-muted opacity-25 my-3",
				style: { borderWidth: "2px" }
			})
		}), /* @__PURE__ */ jsxs("section", {
			className: "section-padding container pt-5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-center mb-5",
				children: /* @__PURE__ */ jsx("h2", {
					className: "section-title",
					style: { marginBottom: 0 },
					children: "Recomendadas según tus gustos"
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4 justify-content-center",
				children: personalizedProducts.map((product) => /* @__PURE__ */ jsx("div", {
					className: "col",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card product-card h-100",
						children: [/* @__PURE__ */ jsx(Link, {
							to: `/product/${product.id}`,
							children: /* @__PURE__ */ jsx("img", {
								src: product.hasImage ? `/api/v1/products/${product.id}/image` : "/new/assets/logo-Cqwofxjs.png",
								className: "card-img-top",
								alt: product.title
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "card-title h5",
									children: product.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "card-text text-muted small",
									children: product.shortDescription
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "price",
									children: [product.price, "€"]
								})
							]
						})]
					})
				}, product.id))
			})]
		})] }),
		/* @__PURE__ */ jsx("section", {
			className: "section-padding bg-light",
			children: /* @__PURE__ */ jsxs("div", {
				className: "container",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "section-title text-center",
					children: "Nuestras Categorías"
				}), /* @__PURE__ */ jsx("div", {
					className: "row g-4",
					children: categories.map((cat) => /* @__PURE__ */ jsx("div", {
						className: "col-md-6 col-lg-3",
						children: /* @__PURE__ */ jsx(Link, {
							to: `/category/${cat.id}`,
							className: "cat-card d-flex align-items-center justify-content-center",
							style: { backgroundImage: `url(${cat.hasImage ? `/api/v1/categories/${cat.id}/image` : logo_default})` },
							children: /* @__PURE__ */ jsx("h3", { children: cat.title })
						})
					}, cat.id))
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "full-menu-cta text-center text-white",
			children: /* @__PURE__ */ jsxs("div", {
				className: "container",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "mb-3",
						children: "¿No sabes qué elegir?"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "lead mb-4",
						children: "Descubre todos nuestros sabores en la carta completa."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/menu",
						className: "btn btn-outline-light btn-cta-secondary",
						children: "Ver Carta Completa"
					})
				]
			})
		}),
		/* @__PURE__ */ jsx(Modal, {
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
		})
	] });
});
//#endregion
export { clientLoader, home_default as default };
