import React, { useState } from 'react';

function AddProductForm({ products, addProductToSale }) {
  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddProduct = () => {
    const selectedProduct = products.find((p) => p.id === parseInt(form.product_id));

    if (!selectedProduct) {
      alert('Por favor selecciona un producto válido.');
      return;
    }

    if (!form.quantity || form.quantity <= 0) {
      alert('La cantidad debe ser mayor a cero.');
      return;
    }

    if (form.quantity > selectedProduct.cantidad_en_stock) {
      alert(`No hay suficiente stock para el producto "${selectedProduct.nombre}".`);
      return;
    }

    const subtotal = selectedProduct.precio * form.quantity;
    addProductToSale(selectedProduct, parseInt(form.quantity), subtotal);

    // Resetear el formulario
    setForm({ product_id: '', quantity: '' });
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <select
        name="product_id"
        value={form.product_id || ''}
        onChange={handleInputChange}
        className="p-2 border rounded"
        required
      >
        <option value="">Selecciona un producto</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.nombre} (Stock: {product.cantidad_en_stock})
          </option>
        ))}
      </select>
      <input
        type="number"
        name="quantity"
        placeholder="Cantidad"
        value={form.quantity || ''}
        onChange={handleInputChange}
        className="p-2 border rounded"
        required
      />
      <button
        type="button"
        onClick={handleAddProduct}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Añadir Producto
      </button>
    </div>
  );
}

export default AddProductForm;
