import React from 'react';

function ProductList({ products, removeProduct }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Productos Seleccionados</h3>
      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Cantidad</th>
            <th className="px-4 py-2">Precio Unitario</th>
            <th className="px-4 py-2">Subtotal</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{product.nombre}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">{product.precio}</td>
              <td className="border px-4 py-2">{product.subtotal}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => removeProduct(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
