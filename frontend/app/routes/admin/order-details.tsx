import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { orderService } from "../../services/order-service";
import { productService } from "../../services/product-service";
import { adminUserService } from "../../services/admin-user-service";
import type { ProductDTO } from "../../dtos/ProductDTO";
import logoImage from "../../assets/images/logo.png";

export async function clientLoader({ params }: any) {
    try {
        const [order, productData, users] = await Promise.all([
            orderService.getOrderById(Number(params.id)),
            productService.getProducts(0, 1000),
            adminUserService.getAllUsers()
        ]);

        // Map the product names to full product objects.
        const allProducts = productData.content;
        const mappedProducts: ProductDTO[] = [];
        let totalPrice = 0;

        // Loop through the titles returned by the backend.
        if (order.productTitles && order.productTitles.length > 0) {
            order.productTitles.forEach(title => {
                const p = allProducts.find(product => product.title === title);
                if (p) {
                    mappedProducts.push(p);
                    totalPrice += p.price;
                }
            });
        }
        // Get the customer name.
        const clientName = order.userEmail
            ? users.find(u => u.email === order.userEmail)?.name || "Invitado"
            : "Invitado";

        return { order, mappedProducts, totalPrice, clientName };
    } catch (error) {
        console.error("Error loading order details:", error);
        throw new Response("Order Not Found", { status: 404 });
    }
}

export default function AdminOrderDetails() {
    const { order, mappedProducts, totalPrice, clientName } = useLoaderData<typeof clientLoader>();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await orderService.deleteOrder(order.id);
            navigate("/admin/orders", {
                state: {
                    message: `El pedido #ORD-${order.id} ha sido eliminado del sistema de forma permanente.`,
                    type: "warning"
                }
            });
        } catch (error) {
            console.error("Error deleting order:", error);
            setIsDeleting(false);
            setShowDeleteModal(false);
            alert("No se pudo eliminar el pedido.");
        }
    };

    return (
        <>
            {/* Page header with back navigation and delete action. */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h1 className="h2 title-font text-dark">Detalle del Pedido #ORD-{order.id}</h1>

                <div className="d-flex gap-2">
                    <Link to="/admin/orders" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left"></i> Volver a Pedidos
                    </Link>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setShowDeleteModal(true)}
                        title="Borrar"
                    >
                        <i className="bi bi-trash"> Borrar pedido</i>
                    </button>
                </div>
            </div>

            {/* Main order information cards. */}
            <div className="row g-4 mb-5">
                {/* Client details. */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-person-lines-fill me-2"></i> Datos del Cliente</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-2"><strong>Nombre:</strong> {clientName}</p>
                            <p className="mb-2"><strong>Email:</strong> {order.userEmail || "No disponible"}</p>
                            <p className="mb-2"><strong>Teléfono:</strong> {order.phoneNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Shipping address. */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-geo-alt-fill me-2"></i> Dirección de Entrega</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-2"><strong>Dirección:</strong> {order.address}</p>
                            <p className="mb-2"><strong>Ciudad:</strong> {order.city}</p>
                            <p className="mb-2"><strong>Código Postal:</strong> {order.postalCode}</p>
                        </div>
                    </div>
                </div>

                {/* Product list and total price. */}
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold text-dark">
                                <i className="bi bi-bag-check-fill me-2 text-primary-custom"></i> Productos del Pedido
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {mappedProducts.length > 0 ? (
                                    mappedProducts.map((product, index) => (
                                        <li key={`${product.id}-${index}`} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <div className="d-flex align-items-center">
                                                {product.hasImage ? (
                                                    <img src={`/api/v1/products/${product.id}/image`} className="rounded-3 me-3" style={{ width: "50px", height: "50px", objectFit: "cover" }} alt={product.title} />
                                                ) : (
                                                    <img src={logoImage} className="rounded-3 me-3 bg-light p-1" style={{ width: "50px", height: "50px", objectFit: "contain" }} alt="Logo" />
                                                )}
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{product.title}</h6>
                                                    {product.categoryTitle ? (
                                                        <small className="text-muted">{product.categoryTitle}</small>
                                                    ) : (
                                                        <small className="text-danger">Sin categoría</small>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="fw-bold text-primary-custom">{product.price}€</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item p-3 text-muted">
                                        No se pudieron cargar los detalles de los productos.
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="card-footer bg-light p-3 text-end">
                            <h4 className="mb-0">Total: <span className="fw-bold text-primary-custom">{totalPrice}€</span></h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal. */}
            {showDeleteModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex={-1} aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title" id="deleteConfirmModalLabel">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} aria-label="Cerrar"></button>
                                </div>
                                <div className="modal-body text-center py-4">
                                    <i className="bi bi-x-circle text-danger mb-3" style={{ fontSize: "3rem" }}></i>
                                    <p className="mb-0 fs-5 text-dark">
                                        ¿Seguro que quieres borrar el pedido #{order.id} permanentemente del sistema?
                                    </p>
                                    <p className="text-muted small mt-2">Esta acción no se puede deshacer.</p>
                                </div>
                                <div className="modal-footer bg-light justify-content-center">
                                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                                        Cancelar
                                    </button>
                                    <button type="button" className="btn btn-danger px-4" onClick={handleDelete} disabled={isDeleting}>
                                        {isDeleting ? "Borrando..." : "Sí, borrar permanentemente"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}