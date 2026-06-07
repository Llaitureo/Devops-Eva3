import { render, screen } from "@testing-library/react";
import { CrudAdmin } from "../componentes/CrudAdmin";

vi.mock("../componentes/Layouts/Navbar", () => ({ default: () => <nav data-testid="navbar-mock" /> }));
vi.mock("../componentes/Layouts/Footer", () => ({ default: () => <footer data-testid="footer-mock" /> }));
vi.mock("../componentes/Layouts/Reviews", () => ({ default: () => <div data-testid="reviews-mock" /> }));

vi.mock("../componentes/CrudAdmin/PruebaCards", () => ({
  PruebaCards: () => <div data-testid="cards-mock">Contenedor de Tarjetas y Tablas</div>
}));

describe("Pruebas estructurales para CrudAdmin", () => {
  it("Debería montar el layout principal y llamar al contenedor de tarjetas", () => {
    render(<CrudAdmin />);
    
    expect(screen.getByTestId("navbar-mock")).toBeDefined();
    expect(screen.getByTestId("cards-mock")).toBeDefined();
    expect(screen.getByTestId("footer-mock")).toBeDefined();
  });
});