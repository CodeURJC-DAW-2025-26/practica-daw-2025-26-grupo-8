import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCartStore } from "../stores/cart-store";
import { useUserStore } from "../stores/user-store";
import { orderService } from "../services/order-service";
import type { OrderRequestDTO } from "../dtos/OrderDTO";

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user, isLogged } = useUserStore();
    const addressData = location.state?.addressData;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If the cart is empty, show a quick link back to the menu.
    if (items.length === 0) {
        return (
            <div className="container section-padding">
                <div className="alert alert-warning" role="alert">
                    <p className="mb-0">Tu carrito está vacío. <a href="/menu" className="alert-link">Vuelve al menú</a></p>
                </div>
            </div>
        );
    }

    // If the user is not authenticated, block checkout.
    if (!isLogged) {
        return (
            <div className="container section-padding">
                <div className="alert alert-info" role="alert">
                    <p className="mb-0">Debes iniciar sesión para realizar un pedido. <a href="/login" className="alert-link">Inicia sesión aquí</a></p>
                </div>
            </div>
        );
    }

    // If checkout data is missing, send the user back to cart flow.
    if (!addressData) {
        return (
            <div className="container section-padding">
                <div className="alert alert-danger" role="alert">
                    <p className="mb-0">No se ha proporcionado una dirección de envío. <a href="/cart" className="alert-link">Vuelve al carrito</a></p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Basic address validation.
            if (!addressData.address || !addressData.city || !addressData.postalCode || !addressData.phoneNumber) {
                setError("Por favor, completa todos los campos");
                setLoading(false);
                return;
            }

            // Build the order payload from cart items and shipping data.
            const orderRequest: OrderRequestDTO = {
                productIds: items.map(item => item.productId),
                address: addressData.address,
                city: addressData.city,
                postalCode: addressData.postalCode,
                phoneNumber: addressData.phoneNumber,
            };

            const order = await orderService.createOrder(orderRequest);

            // Clear the cart after a successful order.
            clearCart();

            // Redirect to profile with the created order id.
            navigate(`/profile?orderId=${order.id}&success=true`);
        } catch (err: any) {
            setError(err.message || "Error al crear la orden. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container section-padding">
            <h2 className="title-font fw-bold mb-5">Finalizar Compra</h2>

            {/* Checkout layout: delivery info on the left, order summary on the right. */}
            <div className="row g-5">
                {/* Delivery information and checkout actions. */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4">Información de Entrega</h5>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError(null)}
                                    ></button>
                                </div>
                            )}

                            <div>
                                <p><strong>Dirección:</strong> {addressData.address}</p>
                                <p><strong>Ciudad:</strong> {addressData.city}</p>
                                <p><strong>Código Postal:</strong> {addressData.postalCode}</p>
                                <p><strong>Teléfono:</strong> {addressData.phoneNumber}</p>
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-custom rounded-pill py-3"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Confirmar Pedido
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill py-3"
                                    onClick={() => navigate("/cart")}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Volver al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order summary card. */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 sticky-top">
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4">Resumen del Pedido</h5>

                            <div className="border-bottom pb-3 mb-3">
                                <p className="text-muted mb-2">Artículos en el carrito:</p>
                                <ul className="list-unstyled small">
                                    {items.map((item) => (
                                        <li key={item.productId} className="d-flex justify-content-between mb-2">
                                            <span>{item.title} x{item.quantity}</span>
                                            <span className="fw-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-3 pb-3 border-bottom">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>{getTotalPrice().toFixed(2)}€</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Gastos de envío:</span>
                                    <span>Gratis</span>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total:</span>
                                <span className="text-primary-custom">{getTotalPrice().toFixed(2)}€</span>
                            </div>

                            {user && (
                                <div className="mt-4 pt-3 border-top">
                                    <p className="text-muted small mb-1">Usuario registrado:</p>
                                    <p className="fw-bold">{user.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
