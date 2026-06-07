import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const API_DESPACHOS = import.meta.env.PROD
  ? '/api/v1/despachos'
  : 'http://localhost:8082/v1/despachos';
const url = `${API_DESPACHOS}`;

export const FormCierreDespacho = ({ despacho, onClose }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      intento: despacho.intento
    }
  });

  const onSubmit = async (data) => {
    
    const isEntregado = data.estadoFinal === "entregado";

    const jsonUpdate = {
      ...despacho,
      intento: parseInt(data.intento),
      despachado: isEntregado
    };

    try {
      await axios.put(`${url}/${despacho.idDespacho}`, jsonUpdate);

      Swal.fire({
        title: isEntregado ? "¡Entrega Finalizada!" : "Estado Actualizado",
        text: isEntregado ? "El despacho se ha cerrado con éxito." : "Se ha registrado el nuevo intento.",
        icon: "success",
        confirmButtonColor: "#0d9488",
      });

      onClose();
    } catch (error) {
      console.error("Error al actualizar despacho:", error);
      Swal.fire("Error", "No se pudo actualizar el registro.", "error");
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">
        Gestionar Despacho #{despacho.idDespacho}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
          <p className="text-sm text-orange-800"><strong>Destino:</strong> {despacho.direccionCompra}</p>
          <p className="text-sm text-orange-800"><strong>OC:</strong> {despacho.idCompra}</p>
        </div>

        {/* Control de Intentos */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Número de Intentos Realizados</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            {...register("intento", { required: true, min: 0 })}
          />
          <p className="text-[10px] text-gray-400 mt-1">* Aumenta este número si el camión fue pero no pudo entregar.</p>
        </div>

        {/* Control del Boolean (despachado) */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Resultado de la Operación</label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            {...register("estadoFinal")}
          >
            <option value="pendiente">Sigue Pendiente (En Ruta)</option>
            <option value="entregado">Entregado con Éxito (Cerrar Orden)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};