import { render, screen, fireEvent } from "@testing-library/react";
import { PruebaCards } from "../componentes/CrudAdmin/PruebaCards";

vi.mock("../componentes/CrudAdmin/TableCompras", () => ({
  TableCompras: () => <div data-testid="table-compras-real">Tabla Compras Montada</div>
}));

vi.mock("../componentes/CrudAdmin/TableDespachos", () => ({
  TableDespachos: () => <div data-testid="table-despachos-real">Tabla Despachos Montada</div>
}));

vi.mock("../componentes/CrudAdmin/CardComponent", () => ({
  CardComponent: ({ title, onClick }) => (
    <div className="border p-4 m-2">
      <h2>{title}</h2>
      <button onClick={onClick}>Consultar</button>
    </div>
  )
}));

describe("Pruebas de comportamiento para el módulo PruebaCards", () => {

  it("Debería iniciar con las dos tablas ocultas (estados en false)", () => {
    render(<PruebaCards />);
    
    expect(screen.queryByTestId("table-compras-real")).toBeNull();
    expect(screen.queryByTestId("table-despachos-real")).toBeNull();
  });

  it("Debería mostrar la tabla de compras y ocultar la de despachos al consultar OCs", () => {
    render(<PruebaCards />);

    const botones = screen.getAllByRole("button", { name: /consultar/i });

    fireEvent.click(botones[0]);
    
    expect(screen.getByTestId("table-compras-real")).toBeDefined();
    expect(screen.queryByTestId("table-despachos-real")).toBeNull();
  });

  it("Debería alternar y mostrar la tabla de despachos al hacer click en la segunda tarjeta", () => {
    render(<PruebaCards />);
    const botones = screen.getAllByRole("button", { name: /consultar/i });
    
    fireEvent.click(botones[1]);
    
    expect(screen.getByTestId("table-despachos-real")).toBeDefined();
    expect(screen.queryByTestId("table-compras-real")).toBeNull();
  });
});