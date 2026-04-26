
import { useCartStore } from "../stores/cart-store";
import { useUserStore } from "../stores/user-store";
import { useAuthModal } from "../contexts/AuthModalContext";
import logoImage from "../assets/images/logo.png";
import { useNavigate } from "react-router";

export default function Cart() {
    const navigate = useNavigate();
    const { items, removeFromCart, getTotalPrice, updateQuantity } = useCartStore();
    const { isLogged } = useUserStore();
    const { openAuthModal } = useAuthModal();
    const isCartEmpty = items.length === 0;

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity > 0) {
            updateQuantity(productId, newQuantity);
        } else {
            removeFromCart(productId);
        }
    };

    const handleCheckout = () => {
        if (!isLogged) {
            openAuthModal("login");
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="container section-padding">
            <h1 className="title-font text-center mb-5 display-5">Finalizar Pedido</h1>

            <div className="row g-5">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body p-4">
                            <h4 className="mb-4 fw-bold text-secondary">Tus Productos</h4>
                            
                            {isCartEmpty ? (
                                <p>Tu carrito está vacío.</p>
                            ) : (
                                items.map(item => (
                                    <div key={item.productId} className="d-flex align-items-center mb-4 pb-4 border-bottom">
                                        <img 
                                            src={item.hasImage ? `/api/v1/products/${item.productId}/image` : logoImage} 
                                            alt={item.title}
                                            className="cart-product-img rounded-3 me-3 shadow-sm"
                                            style={!item.hasImage ? { objectFit: 'contain', backgroundColor: '#f8f9fa', padding: '0.5rem' } : {}}
                                        />
                                        
                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-1">{item.title}</h5>
                                            <div className="d-flex align-items-center">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            <span className="fw-bold fs-5 text-primary-custom">{(item.price * item.quantity).toFixed(2)}€</span>
                                            <button 
                                                type="button" 
                                                className="btn btn-link text-danger p-0 border-0 bg-transparent ms-2"
                                                title="Eliminar del carrito"
                                                onClick={() => removeFromCart(item.productId)}
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

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body p-4">
                            <h4 className="mb-3 fw-bold title-font text-primary-custom">Dirección de Envío</h4>
                            {isLogged ? (
                                 <form action="/order/checkout" method="post">
                                     <div className="mb-3">
                                         <label className="form-label small text-muted">Calle y número</label>
                                         <input type="text" className="form-control" placeholder="Ej: Calle Mayor 12, 3ºA"
                                             required name="address" />
                                     </div>
                                     <div className="row g-2 mb-3">
                                         <div className="col-6">
                                             <label className="form-label small text-muted">Ciudad</label>
                                             <input type="text" className="form-control" value="Madrid" required name="city" />
                                         </div>
                                         <div className="col-6">
                                             <label className="form-label small text-muted">C. Postal</label>
                                             <input type="text" className="form-control" placeholder="28000" required
                                                 name="postalCode" />
                                         </div>
                                     </div>
                                     <div className="mb-3">
                                         <label className="form-label small text-muted">Teléfono de contacto</label>
                                         <input type="tel" className="form-control" placeholder="600 000 000" required
                                             name="phoneNumber" />
                                     </div>
                                 </form>
                            ) : (
                                <div className="text-center">
                                    <p>Debes iniciar sesión para continuar con la compra.</p>
                                    <button className="btn btn-primary" onClick={() => openAuthModal("login")}>Iniciar Sesión</button>
                                </div>
                            )}
                        </div>
                    </div>
                    
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
                                type="button"
                                className="btn btn-primary btn-custom btn-load-more w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 border-0"
                                onClick={handleCheckout}
                                disabled={isCartEmpty}
                            >
                                {isCartEmpty ? (
                                    <>
                                        <i className="bi bi-basket"></i>
                                        <span>Carrito vacío</span>
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
                </div>
            </div>
        </div>
    );
}
