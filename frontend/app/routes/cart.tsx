import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "../stores/cart-store";
import { useUserStore } from "../stores/user-store";
import { useAuthModal } from "../contexts/AuthModalContext";
import { orderService } from "../services/order-service";
import type { OrderRequestDTO } from "../dtos/OrderDTO";
import logoImage from "../assets/images/logo.png";

export default function Cart() {
    const navigate = useNavigate();
    const { items, removeFromCart, clearCart, getTotalPrice } = useCartStore();
    const { isLogged } = useUserStore();
    const { openAuthModal } = useAuthModal();
    const isCartEmpty = items.length === 0;

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        postalCode: "",
        phoneNumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isCartEmpty) {
            return;
        }

        if (!isLogged) {
            openAuthModal("login");
            return;
        }

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
            <h2 className="title-font fw-bold mb-4">Carrito de Compras</h2>

            <div className="row g-5">
                {/* PRODUCTOS LADO IZQUIERDO */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4">Tus Productos</h5>

                            {isCartEmpty ? (
                                <p className="mb-0">Tu carrito está vacío.</p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.productId} className="d-flex align-items-center justify-content-between mb-4 pb-4 border-bottom">
                                        <div className="d-flex align-items-center gap-3 flex-grow-1">
                                            {item.hasImage ? (
                                                <img
                                                    src={`/api/v1/products/${item.productId}/image`}
                                                    alt={item.title}
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={logoImage}
                                                    alt="Sin imagen"
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                            )}
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1">{item.title}</h6>
                                                <p className="text-muted small mb-0">{item.price.toFixed(2)}€</p>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            <p className="fw-bold mb-2">{item.price.toFixed(2)}€</p>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeFromCart(item.productId)}
                                                aria-label="Eliminar del carrito"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* FORMULARIO Y RESUMEN LADO DERECHO */}
                <div className="col-lg-5">
                    <form onSubmit={handleSubmit}>
                        {/* FORMULARIO DE ENVÍO */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-4">Dirección de Envío</h5>

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

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label fw-bold small">
                                        Calle y número
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="form-control"
                                        placeholder="Ej: Calle Mayor 12, 3ªA"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label htmlFor="city" className="form-label fw-bold small">
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

                                    <div className="col-6">
                                        <label htmlFor="postalCode" className="form-label fw-bold small">
                                            C. Postal
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

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label fw-bold small">
                                        Teléfono de contacto
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        className="form-control"
                                        placeholder="600 000 000"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RESUMEN DEL PEDIDO */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-4">Resumen</h5>

                                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                    <span className="text-muted">Subtotal:</span>
                                    <span className="fw-bold">{getTotalPrice().toFixed(2)}€</span>
                                </div>

                                <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
                                    <span className="text-muted">Envío:</span>
                                    <span className="fw-bold text-success">Gratis</span>
                                </div>

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold fs-5">Total:</span>
                                    <span className="fw-bold fs-5 text-primary-custom">{getTotalPrice().toFixed(2)}€</span>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-custom rounded-pill py-3"
                                        disabled={loading || isCartEmpty}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Procesando...
                                            </>
                                        ) : isCartEmpty ? (
                                            <>
                                                <i className="bi bi-cart-x me-2"></i>
                                                Carrito vacío
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
                                        onClick={() => navigate("/menu")}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Continuar Comprando
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-link text-danger w-100 mt-3"
                                    onClick={() => {
                                        if (confirm("¿Deseas vaciar el carrito?")) {
                                            clearCart();
                                        }
                                    }}
                                >
                                    Vaciar Carrito
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
