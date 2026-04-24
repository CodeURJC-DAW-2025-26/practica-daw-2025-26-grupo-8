import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "../stores/cart-store";
import { useUserStore } from "../stores/user-store";
import { orderService } from "../services/order-service";
import type { OrderRequestDTO } from "../dtos/OrderDTO";

export default function Checkout() {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user, isLogged } = useUserStore();

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        postalCode: "",
        phoneNumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Si el carrito está vacío, redirige al carrito
    if (items.length === 0) {
        return (
            <div className="container section-padding">
                <div className="alert alert-warning" role="alert">
                    <p className="mb-0">Tu carrito está vacío. <a href="/menu" className="alert-link">Vuelve al menú</a></p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirige a login (esto se podría manejar con un componente de protección de ruta)
    if (!isLogged) {
        return (
            <div className="container section-padding">
                <div className="alert alert-info" role="alert">
                    <p className="mb-0">Debes iniciar sesión para realizar un pedido. <a href="/login" className="alert-link">Inicia sesión aquí</a></p>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validación básica
            if (!formData.address || !formData.city || !formData.postalCode || !formData.phoneNumber) {
                setError("Por favor, completa todos los campos");
                setLoading(false);
                return;
            }

            // Crear la orden
            const orderRequest: OrderRequestDTO = {
                productIds: items.map(item => item.productId),
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                phoneNumber: formData.phoneNumber,
            };

            const order = await orderService.createOrder(orderRequest);

            // Limpiar el carrito después de crear la orden
            clearCart();

            // Redirigir a la página de éxito o perfil
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

            <div className="row g-5">
                {/* Formulario de dirección */}
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

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label fw-bold">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="form-control"
                                        placeholder="Calle, número, piso..."
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="city" className="form-label fw-bold">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="form-control"
                                            placeholder="Tu ciudad"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="postalCode" className="form-label fw-bold">
                                            Código Postal
                                        </label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            className="form-control"
                                            placeholder="12345"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="phoneNumber" className="form-label fw-bold">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        className="form-control"
                                        placeholder="+34 123 456 789"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-custom rounded-pill py-3"
                                        disabled={loading}
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
                            </form>
                        </div>
                    </div>
                </div>

                {/* Resumen del pedido */}
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
