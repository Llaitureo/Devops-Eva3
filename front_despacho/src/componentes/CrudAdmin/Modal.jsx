import React from "react";

export const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose} 
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 animate-fade-in"
    >
      <div
        onClick={(e) => {
          e.stopPropagation(); 
        }}
        className="flex flex-col items-end bg-white transition-all rounded-lg scale-90 opacity-100 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="z-20 -mb-6 fill-emerald-500 hover:fill-emerald-600 font-bold hover:text-4xl text-3xl bg-teal-600 text-white transition-all w-14 h-14 flex items-center justify-center rounded-bl-xl"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};