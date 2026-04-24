import { t as orderService } from "./order-service-BKvTJaUG.js";
import { t as adminUserService } from "./admin-user-service-CZCeC8sI.js";
import { Link, UNSAFE_withComponentProps, useLoaderData, useLocation } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/admin/orders.tsx
async function clientLoader() {
	try {
		const [orders, users] = await Promise.all([orderService.getAllOrders(), adminUserService.getAllUsers()]);
		return {
			orders,
			users
		};
	} catch (error) {
		console.error("Error loading orders or users:", error);
		return {
			orders: [],
			users: []
		};
	}
}
var orders_default = UNSAFE_withComponentProps(function AdminOrders() {
	const { orders, users } = useLoaderData();
	const location = useLocation();
	const flashMessage = location.state?.message;
	const isWarning = location.state?.type === "warning";
	const getUserName = (email) => {
		if (!email) return "Invitado";
		const user = users.find((u) => u.email === email);
		return user ? user.name : "Invitado";
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		flashMessage && /* @__PURE__ */ jsxs("div", {
			className: `alert ${isWarning ? "alert-warning" : "alert-success"} alert-dismissible fade show mt-3 shadow-sm`,
			role: "alert",
			children: [
				/* @__PURE__ */ jsx("i", { className: `bi ${isWarning ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"} me-2` }),
				" ",
				flashMessage,
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn-close",
					"data-bs-dismiss": "alert",
					"aria-label": "Cerrar"
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom",
			children: /* @__PURE__ */ jsx("h1", {
				className: "h2 title-font text-dark",
				children: "Gestión de Pedidos"
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "card shadow-sm border-0",
			children: /* @__PURE__ */ jsx("div", {
				className: "card-body p-0",
				children: /* @__PURE__ */ jsx("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ jsxs("table", {
						className: "table table-hover mb-0 align-middle",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "table-dark",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "ps-4",
									children: "ID Pedido"
								}),
								/* @__PURE__ */ jsx("th", { children: "Cliente" }),
								/* @__PURE__ */ jsx("th", { children: "Dirección" }),
								/* @__PURE__ */ jsx("th", { children: "Ciudad" }),
								/* @__PURE__ */ jsx("th", { children: "Teléfono" }),
								/* @__PURE__ */ jsx("th", {
									className: "text-end pe-4",
									children: "Acciones"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: orders.length > 0 ? orders.map((order) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsxs("td", {
								className: "ps-4 fw-bold text-secondary",
								children: ["#ORD-", order.id]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "fw-bold",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-person-circle text-muted me-1" }), getUserName(order.userEmail)]
							}),
							/* @__PURE__ */ jsx("td", { children: order.address }),
							/* @__PURE__ */ jsx("td", { children: order.city }),
							/* @__PURE__ */ jsx("td", { children: order.phoneNumber }),
							/* @__PURE__ */ jsx("td", {
								className: "text-end pe-4",
								children: /* @__PURE__ */ jsxs(Link, {
									to: `/admin/orders/${order.id}`,
									className: "btn btn-sm btn-outline-primary",
									children: [/* @__PURE__ */ jsx("i", { className: "bi bi-eye" }), " Ver Detalle"]
								})
							})
						] }, order.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
							colSpan: 6,
							className: "text-center py-5 text-muted",
							children: [
								/* @__PURE__ */ jsx("i", { className: "bi bi-inbox fs-1 d-block mb-2 text-secondary" }),
								/* @__PURE__ */ jsx("h5", {
									className: "fw-bold",
									children: "Sin pedidos"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mb-0",
									children: "Aún no hay ningún pedido registrado en el sistema."
								})
							]
						}) }) })]
					})
				})
			})
		})
	] });
});
//#endregion
export { clientLoader, orders_default as default };
