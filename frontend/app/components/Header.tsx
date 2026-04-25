import { Link, NavLink } from "react-router";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useUserStore } from "../stores/user-store";
import { useCartStore } from "../stores/cart-store";
import { useAuthModal } from "../contexts/AuthModalContext";
import { authService } from "../services/auth-sevice";
import logoImage from "../assets/images/logo.png";

export default function Header() {
    // Leemos de Zustand si estamos logueados y nuestra información
    const { isLogged, isAdmin, removeCurrentUser } = useUserStore();
    const { getTotalItems, clearCart } = useCartStore();
    const { openAuthModal } = useAuthModal();
    const totalItems = getTotalItems();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.warn("No se pudo cerrar sesión en backend, limpiando sesión local igualmente", error);
        } finally {
            removeCurrentUser();
            clearCart();
        }
    };

    return (
        <Navbar expand="lg" sticky="top" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="logo">
                    <img src={logoImage} alt="Logo" />
                    <span>Aparizzio</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="menuNavegacion" className="border-0" />

                <Navbar.Collapse id="menuNavegacion" className="justify-content-end">
                    <Nav className="align-items-center gap-3">
                        <Nav.Link as={NavLink} to="/" className="d-flex align-items-center">
                            <i className="bi bi-house-door-fill me-2"></i> Inicio
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/menu" className="d-flex align-items-center">
                            <i className="bi bi-book-half me-2"></i> Ver Carta
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/cart" className="cart-icon d-flex align-items-center position-relative">
                            <i className="bi bi-cart3 fs-5 me-1"></i>
                            <span>Pedido</span>
                            {totalItems > 0 && (
                                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                                    {totalItems}
                                </span>
                            )}
                        </Nav.Link>

                        {/* Renderizado Condicional: Si NO está logueado */}
                        {!isLogged && (
                            <Nav.Item>
                                <Button
                                    variant="primary"
                                    className="btn-login d-flex align-items-center"
                                    onClick={() => openAuthModal("login")}
                                >
                                    <i className="bi bi-person-circle me-2"></i> Iniciar Sesión
                                </Button>
                            </Nav.Item>
                        )}

                        {/* Renderizado Condicional: Si SÍ está logueado */}
                        {isLogged && (
                            <>
                                {isAdmin && (
                                    <Nav.Link as={NavLink} to="/admin/metrics" className="d-flex align-items-center text-warning fw-bold">
                                        <i className="bi bi-speedometer2 me-2"></i> Admin Panel
                                    </Nav.Link>
                                )}
                                <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center">
                                    <i className="bi bi-person-gear me-2"></i> Mi Perfil
                                </Nav.Link>
                                <Nav.Item>
                                    <Button variant="outline-danger" onClick={handleLogout} className="d-flex align-items-center">
                                        <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                                    </Button>
                                </Nav.Item>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}