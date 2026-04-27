import { useState, useEffect, useMemo } from "react";
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
    useSearchParams,
    useNavigate,
} from "react-router";
import { Alert, Modal } from "react-bootstrap";

// React Router can generate route types if needed.
// import type { Route } from "./+types/root";

// Direct CSS imports for Vite.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthModalProvider, useAuthModal } from "./contexts/AuthModalContext";
import { authService } from "./services/auth-sevice";
import { useUserStore } from "./stores/user-store";
import authImage from "./assets/images/inicio-sesion_resized.jpg";

// Injects external Google Fonts.
export const links = () => [
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Lobster&family=Roboto:wght@400;500;700&display=swap" },
];

// Authentication modal (login/register).
function AuthModal() {
    const { showAuthModal, authView, closeAuthModal, switchAuthView } = useAuthModal();
    const { setCurrentUser } = useUserStore();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const passwordMismatch = useMemo(
        () => registerForm.confirmPassword.length > 0 && registerForm.password !== registerForm.confirmPassword,
        [registerForm.password, registerForm.confirmPassword]
    );

    // Reads query params and opens the correct auth view.
    useEffect(() => {
        const error = searchParams.get("error");
        const authRequired = searchParams.has("auth_required");
        const auth = searchParams.get("auth");

        if (!error && !authRequired && !auth) {
            return;
        }

        if (auth === "register") {
            switchAuthView("register");
        } else {
            switchAuthView("login");
        }

        if (error) {
            setLoginError("Correo o contraseña incorrectos.");
        } else if (authRequired) {
            setLoginError("Tienes que iniciar sesión para acceder a esta página.");
        }

        const cleanParams = new URLSearchParams(searchParams);
        cleanParams.delete("error");
        cleanParams.delete("auth_required");
        cleanParams.delete("auth");

        setSearchParams(cleanParams, { replace: true });
    }, [searchParams, setSearchParams, switchAuthView]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setLoginError(null);

        // Attempt to log in the user and handle success or failure.
        try {
            const loginResponse = await authService.login(loginForm.username, loginForm.password);

            if (String(loginResponse?.status || "").toUpperCase() === "FAILURE") {
                throw new Error(loginResponse?.error || "Credenciales inválidas");
            }

            const me = await authService.getMe();
            setCurrentUser(me);
            closeAuthModal();
            setLoginForm({ username: "", password: "" });

            if (me.roles?.includes("ADMIN")) {
                navigate("/admin/metrics", { replace: true });
            }
        } catch {
            setLoginError("Correo o contraseña incorrectos.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handles user registration and switches to login view on success.
    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRegisterError(null);

        if (passwordMismatch) {
            setRegisterError("Las contraseñas no coinciden.");
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.register(registerForm);
            switchAuthView("login");
            setLoginError("Registro completado. Ahora inicia sesión.");
            setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
        } catch (error) {
            setRegisterError(error instanceof Error ? error.message : "No se pudo completar el registro.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={showAuthModal} onHide={closeAuthModal} centered size="lg">
            <Modal.Body className="p-0">
                <div className="row g-0">
                    {/* Left image panel (desktop only). */}
                    <div className="col-md-5 d-none d-md-block">
                        <img
                            src={authImage}
                            alt="Login"
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: "cover", minHeight: "450px" }}
                        />
                    </div>

                    {/* Right panel with login/register forms. */}
                    <div className="col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
                        {/* Login form. */}
                        {authView === "login" && (
                            <div className="fade-in-left">
                                <h2 className="fw-bold mb-4">¡Hola de nuevo!</h2>

                                {loginError && <Alert variant="warning" className="small py-2">{loginError}</Alert>}

                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label small text-muted">Correo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={loginForm.username}
                                            onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small text-muted">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            required
                                            value={loginForm.password}
                                            onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                                        />
                                    </div>

                                    <div className="d-grid mb-3">
                                        <button type="submit" className="btn btn-primary py-2" disabled={isSubmitting}>
                                            {isSubmitting ? "Entrando..." : "Entrar"}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="small text-muted mb-0">¿No tienes cuenta?</p>
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 fw-bold text-decoration-none"
                                            onClick={() => switchAuthView("register")}
                                        >
                                            Regístrate aquí
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Register form. */}
                        {authView === "register" && (
                            <div className="fade-in-right">
                                <h2 className="fw-bold mb-4">Crear Cuenta</h2>

                                {registerError && <Alert variant="danger" className="small py-2">{registerError}</Alert>}

                                <form onSubmit={handleRegister}>
                                    <div className="mb-3">
                                        <label className="form-label small text-muted">Nombre Completo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ej: Juan Pérez"
                                            required
                                            value={registerForm.name}
                                            onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-muted">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="juan@ejemplo.com"
                                            required
                                            value={registerForm.email}
                                            onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small text-muted">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            required
                                            minLength={4}
                                            value={registerForm.password}
                                            onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small text-muted">Repetir Contraseña</label>
                                        <input
                                            type="password"
                                            className={`form-control ${passwordMismatch ? "is-invalid" : ""}`}
                                            required
                                            minLength={4}
                                            value={registerForm.confirmPassword}
                                            onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                        />
                                        <div className="invalid-feedback">Las contraseñas no coinciden.</div>
                                    </div>

                                    <div className="d-grid mb-3">
                                        <button type="submit" className="btn btn-primary py-2" disabled={isSubmitting || passwordMismatch}>
                                            {isSubmitting ? "Registrando..." : "Registrarse"}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="small text-muted mb-0">¿Ya tienes cuenta?</p>
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 fw-bold text-decoration-none"
                                            onClick={() => switchAuthView("login")}
                                        >
                                            Inicia sesión
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

// Root app layout.
export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        // Full HTML document shell used by React Router.
        <html lang="es">
            {/* Document head metadata and linked resources. */}
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Pizzería Aparizzio (SPA)</title>
                <Meta />
                <Links />
            </head>
            {/* Body layout with header/main/footer and global modal. */}
            <body className="d-flex flex-column min-vh-100">
                <AuthModalProvider>
                    {!isAdminRoute && <Header />}

                    <main className="flex-grow-1">
                        {children}
                    </main>

                    <AuthModal />

                    {!isAdminRoute && <Footer />}
                </AuthModalProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

// Main route outlet.
export default function App() {
    return <Outlet />;
}

// Route-level error boundary.
export function ErrorBoundary({ error }: any) {
    let message = "¡Ups!";
    let details = "Ha ocurrido un error inesperado.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "Error 404" : "Error de Ruta";
        details =
            error.status === 404
                ? "La página solicitada no se pudo encontrar."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-5 p-4 container mx-auto text-center">
            <h1 className="text-danger title-font">{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-100 p-4 overflow-x-auto text-start bg-light mt-4">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}