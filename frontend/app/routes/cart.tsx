import { useNavigate } from "react-router";
import { useCartStore } from "../stores/cart-store";
import logoImage from "../assets/images/logo.png";

export default function Cart() {
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container section-padding">
                <h2 className="title-font fw-bold mb-4">Carrito de Compras</h2>
                <div className="alert alert-info" role="alert">
                    <p className="mb-0">Tu carrito está vacío. <a href="/menu" className="alert-link">Continúa comprando</a></p>
                </div>
            </div>
        );
    }

    return (
        <div className="container section-padding">
            <h2 className="title-font fw-bold mb-4">Carrito de Compras</h2>

            <div className="row">
                <div className="col-lg-8">
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.productId} className="border-bottom">
                                        <td className="py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                {item.hasImage ? (
                                                    <img
                                                        src={`/api/v1/products/${item.productId}/image`}
                                                        alt={item.title}
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            objectFit: "cover",
                                                            borderRadius: "4px"
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={logoImage}
                                                        alt="Sin imagen"
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            objectFit: "cover",
                                                            borderRadius: "4px"
                                                        }}
                                                    />
                                                )}
                                                <a
                                                    href={`/product/${item.productId}`}
                                                    className="text-decoration-none text-dark"
                                                >
                                                    {item.title}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="py-3">{item.price.toFixed(2)}€</td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                                    className="form-control form-control-sm"
                                                    style={{ width: "50px", textAlign: "center" }}
                                                    aria-label="Cantidad"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-3 fw-bold">{(item.price * item.quantity).toFixed(2)}€</td>
                                        <td className="py-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeFromCart(item.productId)}
                                                aria-label="Eliminar del carrito"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <h5 className="card-title fw-bold mb-4">Resumen del Pedido</h5>

                            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                <span>Subtotal:</span>
                                <span>{getTotalPrice().toFixed(2)}€</span>
                            </div>

                            <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                                <span>Total:</span>
                                <span className="text-primary-custom">{getTotalPrice().toFixed(2)}€</span>
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-custom rounded-pill py-3"
                                    onClick={() => navigate("/checkout")}
                                >
                                    <i className="bi bi-credit-card me-2"></i>
                                    Proceder al Pago
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
                </div>
            </div>
        </div>
    );
}
