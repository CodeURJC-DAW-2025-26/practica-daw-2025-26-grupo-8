export default function Footer() {
    return (
        <footer className="footer-section mt-auto">
            <div className="container">
                <div className="row g-5">
                    <div className="col-md-4">
                        <h3>Aparizzio</h3>
                        <p>La mejor pizza de la ciudad desde 1990.</p>
                    </div>
                    <div className="col-md-4">
                        <h3>Contacto</h3>
                        <p className="mb-1">Calle Falsa 123, Ciudad</p>
                        <p>Tel: 555-0199</p>
                    </div>
                    <div className="col-md-4">
                        <h3>Redes Sociales</h3>
                        <p>Instagram | Facebook | Twitter</p>
                    </div>
                </div>
                <div className="copyright mt-5 pt-4 border-top border-secondary text-center">
                    <p>&copy; 2026 Aparizzio Pizzería. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}