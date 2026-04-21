import { Link, NavLink } from "react-router";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useUserStore } from "../stores/user-store";

export default function Header() {
    // Leemos de Zustand si estamos logueados y nuestra información
    const { isLogged, user, removeCurrentUser } = useUserStore();

    return (
        <Navbar expand="lg" sticky="top" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="logo">
                    <img src="/assets/images/logo.png" alt="Logo" />
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
                        <Nav.Link as={NavLink} to="/cart" className="cart-icon d-flex align-items-center">
                            <i className="bi bi-cart3 fs-5 me-1"></i> Pedido
                        </Nav.Link>

                        {/* Renderizado Condicional: Si NO está logueado */}
                        {!isLogged && (
                            <Nav.Item>
                                <Link to="/login" className="btn btn-primary btn-login d-flex align-items-center">
                                    <i className="bi bi-person-circle me-2"></i> Iniciar Sesión
                                </Link>
                            </Nav.Item>
                        )}

                        {/* Renderizado Condicional: Si SÍ está logueado */}
                        {isLogged && (
                            <>
                                <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center">
                                    <i className="bi bi-person-gear me-2"></i> Mi Perfil
                                </Nav.Link>
                                <Nav.Item>
                                    <Button variant="outline-danger" onClick={removeCurrentUser} className="d-flex align-items-center">
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