import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const API_VENTAS = import.meta.env.PROD
  ? '/api/v1/ventas'
  : 'http://localhost:8081/v1/ventas';
const url = `${API_VENTAS}`;

export const FormVenta = ({ onVentaCreada }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const nuevaVenta = {
      direccionCompra: data.direccionCompra,
      valorCompra: parseInt(data.valorCompra),
      fechaCompra: data.fechaCompra,
      despachoGenerado: false
    };

    try {
      await axios.post(url, nuevaVenta);

      Swal.fire({
        title: "¡Venta Registrada!",
        text: "La orden de compra se ha guardado con éxito.",
        icon: "success",
        confirmButtonColor: "#0d9488"
      });

      reset(); 
      if (onVentaCreada) onVentaCreada(); 

    } catch (error) {
      console.error("Error al registrar venta:", error);
      Swal.fire("Error", "No se pudo conectar con el servidor de ventas.", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center border-b pb-4">
        Registro de Venta
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        
        {/* Orden de compra (Informativo ya que es AUTO en DB) */}
        <div className="col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Orden de compra
          </label>
          <input
            type="text"
            disabled
            placeholder="Autogenerado"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 italic"
          />
        </div>

        {/* Fecha de compra */}
        <div className="col-span-1">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            fecha de compra
          </label>
          <input
            type="date"
            className={`w-full p-3 border rounded-lg outline-none transition-all ${errors.fechaCompra ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-teal-500'}`}
            {...register("fechaCompra", { required: "La fecha es obligatoria" })}
          />
        </div>

        {/* Dirección */}
        <div className="col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            direccion
          </label>
          <input
            type="text"
            placeholder="Ingresa la dirección de entrega"
            className={`w-full p-3 border rounded-lg outline-none transition-all ${errors.direccionCompra ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
            {...register("direccionCompra", { required: "La dirección es obligatoria" })}
          />
          {errors.direccionCompra && <p className="text-red-500 text-xs mt-1">{errors.direccionCompra.message}</p>}
        </div>

        {/* Valor Total */}
        <div className="col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            valor total
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">$</span>
            <input
              type="number"
              placeholder="0"
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:border-teal-500 outline-none"
              {...register("valorCompra", { required: true, min: 1 })}
            />
          </div>
        </div>

        {/* Botón de envío */}
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-lg shadow-lg transition-transform active:scale-95 uppercase tracking-widest text-sm"
          >
            Registrar Orden
          </button>
        </div>
      </form>
    </div>
  );
};