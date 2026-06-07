import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";
import Swal from "sweetalert2";

export const API_DESPACHOS = import.meta.env.PROD
  ? '/api/v1/despachos'
  : 'http://localhost:8082/v1/despachos';
const url = `${API_DESPACHOS}`;

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const cargarDespachos = async () => {
    try {
      const response = await axios.get(url);
      setDespachos(response.data);
    } catch (error) {
      console.error("Error al obtener despachos:", error);
    }
  };

  useEffect(() => {
    cargarDespachos();
  }, []);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  return (
    <>
      <section className="flex justify-center mb-8 px-4">
        <div className="w-full max-w-7xl bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-5 px-4 text-xs font-bold text-teal-600 uppercase">N° Despacho</th>
                <th className="px-4 text-xs font-bold text-gray-600 uppercase">OC Relacionada</th>
                <th className="px-4 text-xs font-bold text-gray-600 uppercase">Dirección de Entrega</th>
                <th className="px-4 text-xs font-bold text-gray-600 uppercase">Patente</th>
                <th className="px-4 text-xs font-bold text-gray-600 uppercase">Intentos</th>
                <th className="px-4 text-xs font-bold text-gray-600 uppercase">Estado</th>
                <th className="px-4 text-xs font-bold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {despachos.map((d) => (
                <tr key={d.idDespacho} className="hover:bg-teal-50/20 transition-colors">
                  <td className="py-6 font-bold text-gray-800">#{d.idDespacho}</td>
                  
                  {/* Variable: idCompra */}
                  <td className="text-gray-500 font-medium">OC-{d.idCompra}</td>
                  
                  {/* Variable: direccionCompra */}
                  <td className="text-sm text-gray-700 px-4 max-w-xs">{d.direccionCompra}</td>
                  
                  <td className="text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded-lg border border-gray-200 font-mono">
                      {d.patenteCamion}
                    </span>
                  </td>

                  {/* Variable: intento */}
                  <td>
                    <span className={`text-lg font-bold ${d.intento >= 3 ? 'text-red-500' : 'text-teal-600'}`}>
                      {d.intento}
                    </span>
                  </td>

                  {/* Variable: despachado (Boolean) */}
                  <td>
                    {d.despachado ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700 border border-green-200">
                        Entregado ✅
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-200">
                        En Proceso 🚚
                      </span>
                    )}
                  </td>

                  <td className="py-4">
                    {!d.despachado && (
                      <button
                        onClick={() => handleAbrirModal(d)}
                        className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                      >
                        Gestionar Cierre
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {despachos.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic">
              No hay registros de despacho en la base de datos.
            </div>
          )}
        </div>
      </section>

      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              setOpenModal(false);
              cargarDespachos();
            }}
          />
        )}
      </Modal>
    </>
  );
};