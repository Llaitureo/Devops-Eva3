import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const API_DESPACHOS = import.meta.env.PROD
  ? '/api/v1/despachos'
  : 'http://localhost:8082/v1/despachos';
const url = `${API_DESPACHOS}`;

export const API_VENTAS = import.meta.env.PROD
  ? '/api/v1/ventas'
  : 'http://localhost:8081/v1/ventas';

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const jsonDespacho = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: venta.valorCompra,
      despachado: false 
    };

    const jsonUpdateVenta = { 
      despachoGenerado: true 
    };

    try {  
      await axios.put(`${API_VENTAS}/${venta.idVenta}`, jsonUpdateVenta);
      await axios.post(`${API_DESPACHOS}`, jsonDespacho);

      Swal.fire({
        title: "¡Despacho Creado!",
        text: "La orden se ha registrado exitosamente.",
        icon: "success",
        confirmButtonColor: "#0d9488",
      });

      onClose();
    } catch (error) {
      console.error("Error al procesar el despacho:", error);
      Swal.fire("Error", "Hubo un fallo en el servidor al guardar.", "error");
    }
  };

  return (
    <div className="p-10 bg-white rounded-2xl">
      <div className="text-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">
          Generar Despacho #{venta.idVenta}
        </h2>
        <p className="text-gray-400 mt-2 italic">Ingresa los datos logísticos para la entrega</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Fila 1: Datos que ya conocemos (Solo lectura) */}
          <div className="md:col-span-2 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
            <p className="text-xs font-bold text-teal-700 uppercase mb-2">Resumen de la Orden</p>
            <p className="text-sm text-gray-600"><strong>Dirección:</strong> {venta.direccionCompra}</p>
            <p className="text-sm text-gray-600"><strong>Monto:</strong> ${venta.valorCompra?.toLocaleString()}</p>
          </div>

          {/* Fila 2: Inputs que debe llenar el usuario */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Fecha Programada</label>
            <input
              type="date"
              className={`p-3 border rounded-xl outline-none transition-all ${errors.fechaDespacho ? 'border-red-500 ring-2 ring-red-50' : 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50'}`}
              {...register("fechaDespacho", { required: "Campo obligatorio" })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Patente del Camión</label>
            <input
              type="text"
              placeholder="AB-CD-12"
              className={`p-3 border rounded-xl outline-none transition-all ${errors.patenteCamion ? 'border-red-500 ring-2 ring-red-50' : 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50'}`}
              {...register("patenteCamion", { required: "Campo obligatorio" })}
            />
          </div>
        </div>

        {/* Botón de acción centrado */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="w-full md:w-3/4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-100 transition-all active:scale-95 uppercase tracking-widest"
          >
            Confirmar Despacho
          </button>
        </div>
      </form>
    </div>
  );
};