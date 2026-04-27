
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "../stores/cart-store";
import logoImage from "../assets/images/logo.png";
import { orderService } from "../services/order-service";
import type { OrderRequestDTO } from "../dtos/OrderDTO";

export default function Cart() {
    const navigate = useNavigate();
    const { items, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    // This page shows the cart, collects the shipping data, and submits the order.
    const isCartEmpty = items.length === 0;
    const displayedItems = items.flatMap((item) =>
        Array.from({ length: item.quantity }, (_, index) => ({
            ...item,
            lineKey: `${item.productId}-${index}`,
        }))
    );

    const [addressData, setAddressData] = useState({
        address: "",
        city: "Madrid",
        postalCode: "",
        phoneNumber: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isCartEmpty || loading) {
            return;
        }

        if (!addressData.address || !addressData.city || !addressData.postalCode || !addressData.phoneNumber) {
            setError("Por favor, completa todos los campos");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const orderRequest: OrderRequestDTO = {
                productIds: items.flatMap(item => Array.from({ length: item.quantity }, () => item.productId)),
                address: addressData.address,
                city: addressData.city,
                postalCode: addressData.postalCode,
                phoneNumber: addressData.phoneNumber,
            };

            const order = await orderService.createOrder(orderRequest);
            clearCart();
            navigate(`/profile?orderId=${order.id}&success=true`);
        } catch (err: any) {
            setError(err.message || "Error al crear la orden. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container section-padding">
            {/* Page title. */}
            <h1 className="title-font text-center mb-5 display-5">Finalizar Pedido</h1>

            {/* Error message shown when checkout fails. */}
            {error && (
                <div className="alert alert-danger mb-4" role="alert">
                    {error}
                </div>
            )}

            {/* Main checkout layout with items on the left and the form on the right. */}
            <div className="row g-5">
                {/* Cart items list. */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body p-4">
                            <h4 className="mb-4 fw-bold text-secondary">Tus Productos</h4>

                            {isCartEmpty ? (
                                <p>Tu carrito está vacío.</p>
                            ) : (
                                displayedItems.map(item => (
                                    <div key={item.lineKey} className="d-flex align-items-center mb-4 pb-4 border-bottom">
                                        <img
                                            src={item.hasImage ? `/api/v1/products/${item.productId}/image` : logoImage}
                                            alt={item.title}
                                            className="cart-product-img rounded-3 me-3 shadow-sm"
                                            style={!item.hasImage ? { objectFit: 'contain', backgroundColor: '#f8f9fa', padding: '0.5rem' } : {}}
                                        />

                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-1">{item.title}</h5>
                                        </div>

                                        <div className="text-end">
                                            <span className="fw-bold fs-5 text-primary-custom">{item.price.toFixed(2)}€</span>
                                            <button
                                                type="button"
                                                className="btn btn-link text-danger p-0 border-0 bg-transparent ms-2"
                                                title="Eliminar del carrito"
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            >
                                                <i className="bi bi-trash fs-5"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Shipping form and order summary. */}
                <div className="col-lg-4">
                    <form onSubmit={handleCheckout}>
                        {/* Shipping address section. */}
                        <div className="card shadow-sm border-0 rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h4 className="mb-3 fw-bold title-font text-primary-custom">Dirección de Envío</h4>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Calle y número</label>
                                    <input type="text" className="form-control" placeholder="Ej: Calle Mayor 12, 3ºA"
                                        required name="address" value={addressData.address} onChange={handleInputChange} />
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label small text-muted">Ciudad</label>
                                        <input type="text" className="form-control" value={addressData.city} required name="city" onChange={handleInputChange} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small text-muted">C. Postal</label>
                                        <input type="text" className="form-control" placeholder="28000" required
                                            name="postalCode" value={addressData.postalCode} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Teléfono de contacto</label>
                                    <input type="tel" className="form-control" placeholder="600 000 000" required
                                        name="phoneNumber" value={addressData.phoneNumber} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        {/* Order summary and submit button. */}
                        <div className="card shadow border-0 rounded-4 bg-white">
                            <div className="card-body p-4">
                                <h4 className="mb-4 fw-bold">Resumen</h4>
                                <div className="d-flex justify-content-between mb-2 text-muted">
                                    <span>Subtotal</span>
                                    <span>{getTotalPrice().toFixed(2)}€</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Envío</span>
                                    <span className="text-success">Gratis</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fs-4 fw-bold title-font">Total</span>
                                    <span className="fs-4 fw-bold text-primary-custom">{getTotalPrice().toFixed(2)}€</span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-custom btn-load-more w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 border-0"
                                    disabled={isCartEmpty || loading}
                                >
                                    {isCartEmpty ? (
                                        <>
                                            <i className="bi bi-basket"></i>
                                            <span>Carrito vacío</span>
                                        </>
                                    ) : loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Procesando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Confirmar Pedido</span>
                                            <i className="bi bi-check-circle-fill"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
