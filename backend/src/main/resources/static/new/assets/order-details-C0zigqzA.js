import { t as logo_default } from "./logo-dqhES8Zi.js";
import { t as productService } from "./product-service-BkwnfBmn.js";
import { t as orderService } from "./order-service-BKvTJaUG.js";
import { t as adminUserService } from "./admin-user-service-CZCeC8sI.js";
import { Link, UNSAFE_withComponentProps, useLoaderData, useNavigate } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region app/routes/admin/order-details.tsx
async function clientLoader({ params }) {
	try {
		const [order, productData, users] = await Promise.all([
			orderService.getOrderById(Number(params.id)),
			productService.getProducts(0, 1e3),
			adminUserService.getAllUsers()
		]);
		const allProducts = productData.content;
		const mappedProducts = [];
		let totalPrice = 0;
		if (order.productTitles && order.productTitles.length > 0) order.productTitles.forEach((title) => {
			const p = allProducts.find((product) => product.title === title);
			if (p) {
				mappedProducts.push(p);
				totalPrice += p.price;
			}
		});
		const clientName = order.userEmail ? users.find((u) => u.email === order.userEmail)?.name || "Invitado" : "Invitado";
		return {
			order,
			mappedProducts,
			totalPrice,
			clientName
		};
	} catch (error) {
		console.error("Error loading order details:", error);
		throw new Response("Order Not Found", { status: 404 });
	}
}
var order_details_default = UNSAFE_withComponentProps(function AdminOrderDetails() {
	const { order, mappedProducts, totalPrice, clientName } = useLoaderData();
	const navigate = useNavigate();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await orderService.deleteOrder(order.id);
			navigate("/admin/orders", { state: {
				message: `El pedido #ORD-${order.id} ha sido eliminado del sistema de forma permanente.`,
				type: "warning"
			} });
		} catch (error) {
			console.error("Error deleting order:", error);
			setIsDeleting(false);
			setShowDeleteModal(false);
			alert("No se pudo eliminar el pedido.");
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom",
			children: [/* @__PURE__ */ jsxs("h1", {
				className: "h2 title-font text-dark",
				children: ["Detalle del Pedido #ORD-", order.id]
			}), /* @__PURE__ */ jsxs("div", {
				className: "d-flex gap-2",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/admin/orders",
					className: "btn btn-outline-secondary",
					children: [/* @__PURE__ */ jsx("i", { className: "bi bi-arrow-left" }), " Volver a Pedidos"]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn-sm btn-outline-danger",
					onClick: () => setShowDeleteModal(true),
					title: "Borrar",
					children: /* @__PURE__ */ jsx("i", {
						className: "bi bi-trash",
						children: " Borrar pedido"
					})
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "row g-4 mb-5",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card shadow-sm border-0 h-100",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header bg-dark text-white",
							children: /* @__PURE__ */ jsxs("h5", {
								className: "mb-0 fw-bold",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-person-lines-fill me-2" }), " Datos del Cliente"]
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "mb-2",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Nombre:" }),
										" ",
										clientName
									]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mb-2",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Email:" }),
										" ",
										order.userEmail || "No disponible"
									]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mb-2",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Teléfono:" }),
										" ",
										order.phoneNumber
									]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "col-md-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card shadow-sm border-0 h-100",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header bg-dark text-white",
							children: /* @__PURE__ */ jsxs("h5", {
								className: "mb-0 fw-bold",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-geo-alt-fill me-2" }), " Dirección de Entrega"]
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "mb-2",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Dirección:" }),
										" ",
										order.address
									]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mb-2",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Ciudad:" }),
										" ",
										order.city
									]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mb-2",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Código Postal:" }),
										" ",
										order.postalCode
									]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "col-12",
					children: /* @__PURE__ */ jsxs("div", {
						className: "card shadow-sm border-0",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "card-header bg-white py-3",
								children: /* @__PURE__ */ jsxs("h5", {
									className: "mb-0 fw-bold text-dark",
									children: [/* @__PURE__ */ jsx("i", { className: "bi bi-bag-check-fill me-2 text-primary-custom" }), " Productos del Pedido"]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "card-body p-0",
								children: /* @__PURE__ */ jsx("ul", {
									className: "list-group list-group-flush",
									children: mappedProducts.length > 0 ? mappedProducts.map((product, index) => /* @__PURE__ */ jsxs("li", {
										className: "list-group-item d-flex justify-content-between align-items-center p-3",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "d-flex align-items-center",
											children: [product.hasImage ? /* @__PURE__ */ jsx("img", {
												src: `/api/v1/products/${product.id}/image`,
												className: "rounded-3 me-3",
												style: {
													width: "50px",
													height: "50px",
													objectFit: "cover"
												},
												alt: product.title
											}) : /* @__PURE__ */ jsx("img", {
												src: logo_default,
												className: "rounded-3 me-3 bg-light p-1",
												style: {
													width: "50px",
													height: "50px",
													objectFit: "contain"
												},
												alt: "Logo"
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h6", {
												className: "mb-0 fw-bold",
												children: product.title
											}), product.categoryTitle ? /* @__PURE__ */ jsx("small", {
												className: "text-muted",
												children: product.categoryTitle
											}) : /* @__PURE__ */ jsx("small", {
												className: "text-danger",
												children: "Sin categoría"
											})] })]
										}), /* @__PURE__ */ jsxs("span", {
											className: "fw-bold text-primary-custom",
											children: [product.price, "€"]
										})]
									}, `${product.id}-${index}`)) : /* @__PURE__ */ jsx("li", {
										className: "list-group-item p-3 text-muted",
										children: "No se pudieron cargar los detalles de los productos."
									})
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "card-footer bg-light p-3 text-end",
								children: /* @__PURE__ */ jsxs("h4", {
									className: "mb-0",
									children: ["Total: ", /* @__PURE__ */ jsxs("span", {
										className: "fw-bold text-primary-custom",
										children: [totalPrice, "€"]
									})]
								})
							})
						]
					})
				})
			]
		}),
		showDeleteModal && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", { className: "modal-backdrop fade show" }), /* @__PURE__ */ jsx("div", {
			className: "modal fade show d-block",
			tabIndex: -1,
			"aria-labelledby": "deleteConfirmModalLabel",
			"aria-hidden": "true",
			children: /* @__PURE__ */ jsx("div", {
				className: "modal-dialog modal-dialog-centered",
				children: /* @__PURE__ */ jsxs("div", {
					className: "modal-content border-0 shadow-lg",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "modal-header bg-danger text-white",
							children: [/* @__PURE__ */ jsxs("h5", {
								className: "modal-title",
								id: "deleteConfirmModalLabel",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-exclamation-triangle-fill me-2" }), " Confirmar Eliminación"]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn-close btn-close-white",
								onClick: () => setShowDeleteModal(false),
								"aria-label": "Cerrar"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "modal-body text-center py-4",
							children: [
								/* @__PURE__ */ jsx("i", {
									className: "bi bi-x-circle text-danger mb-3",
									style: { fontSize: "3rem" }
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mb-0 fs-5 text-dark",
									children: [
										"¿Seguro que quieres borrar el pedido #",
										order.id,
										" permanentemente del sistema?"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-muted small mt-2",
									children: "Esta acción no se puede deshacer."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "modal-footer bg-light justify-content-center",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-outline-secondary px-4",
								onClick: () => setShowDeleteModal(false),
								disabled: isDeleting,
								children: "Cancelar"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn-danger px-4",
								onClick: handleDelete,
								disabled: isDeleting,
								children: isDeleting ? "Borrando..." : "Sí, borrar permanentemente"
							})]
						})
					]
				})
			})
		})] })
	] });
});
//#endregion
export { clientLoader, order_details_default as default };
