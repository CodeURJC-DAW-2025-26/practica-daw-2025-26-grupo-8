import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
} from "react-router";

// Importamos los tipos autogenerados por React Router
import type { Route } from "./+types/root";

// 1. Importaciones directas de CSS (La forma que le gusta a Vite)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

// 2. Usamos 'links' solo para inyectar recursos externos de Google
export const links = () => [
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Lobster&family=Roboto:wght@400;500;700&display=swap" },
];

// 3. El Layout: El chasis exacto del profesor, pero con tus componentes
export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <html lang="es">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Pizzería Aparizzio (SPA)</title>
                <Meta />
                <Links />
            </head>
            <body className="d-flex flex-column min-vh-100">
                {!isAdminRoute && <Header />}

                <main className="flex-grow-1">
                    {children}
                </main>

                {!isAdminRoute && <Footer />}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

// 4. La App principal
export default function App() {
    return <Outlet />;
}

// 5. El capturador de errores del profesor (Evita el pantallazo en blanco si algo falla)
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
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