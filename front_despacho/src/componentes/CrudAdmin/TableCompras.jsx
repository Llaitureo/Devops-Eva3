import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import { FormVenta } from "./FormVenta";
import axios from "axios";

export const API_VENTAS = import.meta.env.PROD
  ? '/api/v1/ventas'
  : 'http://localhost:8081/v1/ventas';

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const compras = async () => {
    try {
      const response = await axios.get(`${API_VENTAS}`);
      setVentas(response.data);
    } catch (error) {
      console.error("Error al cargar ventas", error);
    }
  };

  useEffect(() => {
    compras();
  }, []);

  const handleAbrirModal = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModal(true);
  };

  return (
    <>
      <div className="container mx-auto py-8">
        {/* 3. Botón para Crear Nueva Venta */}
        <div className="flex justify-end mb-4 px-10">
          <button
            onClick={() => setOpenCreateModal(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-all"
          >
            + Registrar Nueva Venta
          </button>
        </div>

        <section className="grid text-center grid-cols-12 mb-8">
          <div className="col-span-12 flex justify-center">
            <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow h-full overflow-hidden">
              <table className="table-fixed w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-4">Orden de compra</th>
                    <th>Dirección</th>
                    <th>Fecha de compra</th>
                    <th>Valor total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas
                    .filter((venta) => !venta.despachoGenerado)
                    .map((venta) => (
                      <tr key={venta.idVenta} className="border-b hover:bg-gray-50">
                        <td className="py-6">{venta.idVenta}</td>
                        <td>{venta.direccionCompra}</td>
                        <td>{venta.fechaCompra}</td>
                        <td>${venta.valorCompra.toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => handleAbrirModal(venta)}
                            className="py-1 bg-orange-200 px-6 rounded-xl shadow-md hover:bg-orange-300 transition-all"
                          >
                            Generar Despacho
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Modal para Generar Despacho (Existente) */}
      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={() => {
              setOpenModal(false);
              compras();
            }}
          />
        )}
      </Modal>

      {/* 5. Modal para Crear Venta (NUEVO) */}
      <Modal onClose={() => setOpenCreateModal(false)} open={openCreateModal}>
        <FormVenta 
          onVentaCreada={() => {
            setOpenCreateModal(false);
            compras();
          }} 
        />
      </Modal>
    </>
  );
};