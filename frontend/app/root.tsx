import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
// 1. Importamos el CSS añadiendo "?url" al final para que Vite lo trate como un archivo estático
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";

// 2. Usamos la función "links" propia de React Router para inyectar el CSS en el <head>
export const links = () => [
    { rel: "stylesheet", href: "bootstrap/dist/css/bootstrap.min.css?url" },
];

export default function Root() {
    return (
        <html lang="es">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                {/* Aquí es donde React Router inyectará automáticamente el CSS de Bootstrap */}
                <Links />
            </head>
            <body>
                <Header />
                <main className="container">
                    <h1 className="mb-4">Bienvenido a Pizzería Aparizzio</h1>
                    <Outlet />
                </main>
                <footer className="text-center mt-5 py-3 border-top">
                    <p>&copy; 2026 Pizzería Aparizzio - Proyecto DAW</p>
                </footer>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}