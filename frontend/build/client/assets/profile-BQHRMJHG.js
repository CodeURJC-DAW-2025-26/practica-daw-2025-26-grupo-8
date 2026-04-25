import { t as useUserStore } from "./user-store-C1C9MW7l.js";
import { t as authService } from "./auth-sevice-BIBssFFh.js";
import { t as productService } from "./product-service-B3WJV0b7.js";
import { Link, UNSAFE_withComponentProps, redirect, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/services/user-service.ts
var userService = { 
/**
* Envía los datos actualizados del perfil al backend.
* Según el Tema 3, usamos fetch nativo.
*/
async updateProfile(data) {
	const response = await fetch(`/api/v1/users/me`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	if (!response.ok) throw new Error("Error al actualizar el perfil");
	return response.json();
} };
//#endregion
//#region app/routes/profile.tsx
/**
* CLIENT LOADER: Solo protege la página, devuelve el usuario inmediatamente.
* Los pedidos se cargan en segundo plano con useEffect para evitar delay.
*/
async function clientLoader() {
	const user = useUserStore.getState().user;
	if (!user) return redirect("/?auth=login&auth_required=1");
	return { user };
}
var profile_default = UNSAFE_withComponentProps(function Profile() {
	const { user } = useLoaderData();
	const setCurrentUser = useUserStore((state) => state.setCurrentUser);
	const [orders, setOrders] = useState([]);
	const [pricesByTitle, setPricesByTitle] = useState(/* @__PURE__ */ new Map());
	const [loadingOrders, setLoadingOrders] = useState(true);
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
		newPassword: "",
		oldPassword: ""
	});
	const [status, setStatus] = useState(null);
	useEffect(() => {
		const loadOrders = async () => {
			try {
				setLoadingOrders(true);
				const [ordersData, catalog] = await Promise.all([authService.getMyOrders(), productService.getProducts(0, 1e3)]);
				setOrders(ordersData);
				const priceMap = /* @__PURE__ */ new Map();
				for (const product of catalog.content) priceMap.set(product.title, product.price);
				setPricesByTitle(priceMap);
			} catch (error) {
				console.error("Error cargando pedidos:", error);
				setOrders([]);
			} finally {
				setLoadingOrders(false);
			}
		};
		loadOrders();
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setCurrentUser(await userService.updateProfile({
				name: formData.name,
				email: formData.email,
				newPassword: formData.newPassword || void 0,
				oldPassword: formData.oldPassword
			}));
			setFormData((prev) => ({
				...prev,
				newPassword: "",
				oldPassword: ""
			}));
			setStatus({
				type: "success",
				msg: "¡Perfil actualizado correctamente!"
			});
		} catch {
			setStatus({
				type: "danger",
				msg: "Error: La contraseña actual es incorrecta. No se han guardado los cambios."
			});
		}
	};
	return /* @__PURE__ */ jsxs(Container, {
		className: "section-padding mt-4 mb-5",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "section-title text-center mb-5",
				children: "Mi Perfil"
			}),
			status && /* @__PURE__ */ jsx(Alert, {
				variant: status.type,
				dismissible: true,
				onClose: () => setStatus(null),
				className: "text-center",
				children: status.msg
			}),
			/* @__PURE__ */ jsxs(Row, {
				className: "g-5",
				children: [/* @__PURE__ */ jsx(Col, {
					md: 6,
					children: /* @__PURE__ */ jsxs(Card, {
						className: "shadow-sm h-100",
						children: [/* @__PURE__ */ jsx(Card.Header, {
							className: "bg-primary text-white",
							children: /* @__PURE__ */ jsxs("h3", {
								className: "h5 mb-0",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-person-gear me-2" }), "Editar Información"]
							})
						}), /* @__PURE__ */ jsx(Card.Body, {
							className: "p-4",
							children: /* @__PURE__ */ jsxs(Form, {
								onSubmit: handleSubmit,
								children: [
									/* @__PURE__ */ jsxs(Form.Group, {
										className: "mb-3",
										children: [/* @__PURE__ */ jsx(Form.Label, {
											className: "fw-bold text-muted mb-1",
											htmlFor: "name",
											children: "Nombre"
										}), /* @__PURE__ */ jsx(Form.Control, {
											id: "name",
											type: "text",
											value: formData.name,
											onChange: (e) => setFormData({
												...formData,
												name: e.target.value
											}),
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs(Form.Group, {
										className: "mb-3",
										children: [/* @__PURE__ */ jsx(Form.Label, {
											className: "fw-bold text-muted mb-1",
											htmlFor: "email",
											children: "Correo Electrónico"
										}), /* @__PURE__ */ jsx(Form.Control, {
											id: "email",
											type: "email",
											value: formData.email,
											onChange: (e) => setFormData({
												...formData,
												email: e.target.value
											}),
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs(Form.Group, {
										className: "mb-4",
										children: [/* @__PURE__ */ jsx(Form.Label, {
											className: "fw-bold text-muted mb-1",
											htmlFor: "newPassword",
											children: "Nueva Contraseña"
										}), /* @__PURE__ */ jsx(Form.Control, {
											id: "newPassword",
											type: "password",
											placeholder: "Dejar en blanco para mantener la actual",
											value: formData.newPassword,
											onChange: (e) => setFormData({
												...formData,
												newPassword: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ jsx("hr", { className: "mb-4" }),
									/* @__PURE__ */ jsxs(Form.Group, {
										className: "mb-4",
										children: [
											/* @__PURE__ */ jsx(Form.Label, {
												className: "fw-bold text-danger mb-1",
												htmlFor: "oldPassword",
												children: "Contraseña Actual *"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "small text-muted mb-2",
												children: "Debes introducir tu contraseña actual para guardar cualquier cambio."
											}),
											/* @__PURE__ */ jsx(Form.Control, {
												id: "oldPassword",
												type: "password",
												className: "border-danger",
												value: formData.oldPassword,
												onChange: (e) => setFormData({
													...formData,
													oldPassword: e.target.value
												}),
												required: true
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "d-grid",
										children: /* @__PURE__ */ jsx(Button, {
											type: "submit",
											className: "btn-cta",
											children: "Guardar Cambios"
										})
									})
								]
							})
						})]
					})
				}), /* @__PURE__ */ jsx(Col, {
					md: 6,
					children: /* @__PURE__ */ jsxs(Card, {
						className: "shadow-sm h-100",
						children: [/* @__PURE__ */ jsx(Card.Header, {
							className: "bg-dark text-white",
							children: /* @__PURE__ */ jsxs("h3", {
								className: "h5 mb-0",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-bag-check me-2" }), "Mis Pedidos"]
							})
						}), /* @__PURE__ */ jsx(Card.Body, {
							className: "p-4",
							children: loadingOrders ? /* @__PURE__ */ jsxs("div", {
								className: "text-center py-5",
								children: [/* @__PURE__ */ jsx(Spinner, {
									animation: "border",
									role: "status",
									className: "text-primary mb-3",
									children: /* @__PURE__ */ jsx("span", {
										className: "visually-hidden",
										children: "Cargando pedidos..."
									})
								}), /* @__PURE__ */ jsx("p", {
									className: "text-muted",
									children: "Cargando tus pedidos..."
								})]
							}) : orders.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "text-center text-muted mt-4",
								children: [
									/* @__PURE__ */ jsx("i", { className: "bi bi-receipt display-4 d-block mb-3" }),
									/* @__PURE__ */ jsx("p", { children: "Aún no has realizado ningún pedido." }),
									/* @__PURE__ */ jsx(Link, {
										to: "/menu",
										className: "btn btn-outline-primary mt-2",
										children: "Ver la carta"
									})
								]
							}) : /* @__PURE__ */ jsx(Fragment, { children: orders.map((order) => /* @__PURE__ */ jsxs(Card, {
								className: "mb-3 border-0 shadow-sm",
								children: [/* @__PURE__ */ jsx(Card.Header, {
									className: "bg-light d-flex justify-content-between align-items-center border-bottom-0",
									children: /* @__PURE__ */ jsxs("h5", {
										className: "mb-0 text-primary fw-bold",
										children: ["Pedido #", order.id]
									})
								}), /* @__PURE__ */ jsx(Card.Body, {
									className: "p-0",
									children: /* @__PURE__ */ jsx("ul", {
										className: "list-group list-group-flush",
										children: (order.productTitles || []).map((title, index) => /* @__PURE__ */ jsxs("li", {
											className: "list-group-item d-flex justify-content-between align-items-center bg-transparent",
											children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("i", { className: "bi bi-caret-right text-secondary me-2" }), title] }), /* @__PURE__ */ jsx("span", {
												className: "text-muted fw-bold",
												children: pricesByTitle.has(title) ? `${pricesByTitle.get(title)}€` : "-"
											})]
										}, `${order.id}-${title}-${index}`))
									})
								})]
							}, order.id)) })
						})]
					})
				})]
			})
		]
	});
});
//#endregion
export { clientLoader, profile_default as default };
