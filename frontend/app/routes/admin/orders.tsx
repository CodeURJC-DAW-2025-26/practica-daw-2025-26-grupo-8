import { useLoaderData } from "react-router";

export async function clientLoader() {
    return { data: "Orders admin page" };
}

export default function AdminOrders() {
    return (
        <div>
            <h2>Gestión de Pedidos</h2>
            <p>Sección en construcción...</p>
        </div>
    );
}