import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export default function Root() {
    return (
        <html lang="es">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {/* Aquí pondremos el Navbar dentro de poco */}
                <main>
                    {/* El <Outlet /> es el hueco dinámico donde React cargará las páginas */}
                    <Outlet />
                </main>
                {/* Aquí pondremos el Footer */}

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}