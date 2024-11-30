import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';
import AddProductForm from './AddProductForm'; // Nuevo componente
import ProductList from './ProductList'; // Nuevo componente

function Sales() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProductToSale = (product, quantity, subtotal) => {
    setSelectedProducts([...selectedProducts, { ...product, quantity, subtotal }]);
    setTotal(total + subtotal);
  };

  const removeProductFromSale = (index) => {
    const productToRemove = selectedProducts[index];
    setTotal(total - productToRemove.subtotal);
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleConfirmSale = async () => {
    if (selectedProducts.length === 0) {
      alert('No has seleccionado ningún producto para la venta.');
      return;
    }
  
    try {
      const salePayload = {
        items: selectedProducts.map((product) => ({
          product_id: product.id,
          cantidad: product.quantity,
          subtotal: product.subtotal,
        })),
        total,
      };
  
      console.log('Payload enviado al backend:', JSON.stringify(salePayload, null, 2));
  
      const response = await apiClient.post('/sales', salePayload);
      console.log('Respuesta del backend:', response.data);
  
      alert('Venta registrada exitosamente.');
      setSelectedProducts([]);
      setTotal(0);
    } catch (error) {
      console.error('Error al registrar la venta:', error);
  
      if (error.response) {
        console.error('Respuesta del backend:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Error al registrar la venta.'}`);
      } else {
        alert('Hubo un error al conectar con el servidor.');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registrar Venta</h2>
      <AddProductForm products={products} addProductToSale={addProductToSale} />
      <ProductList products={selectedProducts} removeProduct={removeProductFromSale} />
      <div className="mt-4">
        <h3 className="text-lg font-bold">Total: {total.toFixed(2)}</h3>
        <button
          onClick={handleConfirmSale}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
        >
          Confirmar Venta
        </button>
      </div>
    </div>
  );
}

export default Sales;
