import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';

function Sales() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('id');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSales, setFilteredSales] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const productsResponse = await apiClient.get('/products');
                setProducts(productsResponse.data);
                const salesResponse = await apiClient.get('/sales');
                const salesData = salesResponse.data;
                const processedSales = salesData.map((sale) => ({
                    ...sale,
                    product_names: sale.items?.map((item) => item.product_name).join(', ') || 'N/A',
                }));
                setSales(processedSales);
                setFilteredSales(processedSales);
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError("No se pudieron cargar los datos. Intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = sales.filter((sale) => {
            if (filter === 'id') {
                return sale.id.toString().includes(lowercasedSearchTerm);
            } else if (filter === 'fecha') {
                return sale.fecha.toLowerCase().includes(lowercasedSearchTerm);
            } else if (filter === 'producto') {
                return sale.product_names.toLowerCase().includes(lowercasedSearchTerm);
            } else if (filter === 'total') {
                return sale.total.toString().includes(lowercasedSearchTerm);
            }
            return false;
        });
        setFilteredSales(filtered);
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
                    producto: product.nombre,
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

            <h2 className="text-2xl font-bold mb-4">Ventas</h2>
            <div className="mb-4">
                <label htmlFor="filter" className="mr-2">Filtrar por:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mr-2"
                >
                    <option value="id">ID</option>
                    <option value="fecha">Fecha</option>
                    <option value="producto">Producto</option>
                    <option value="total">Total</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>
            </div>
            <table className="table-auto w-full bg-white shadow-md">
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Producto</th>
                        <th className="px-4 py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSales.map((sale) => (
                        <tr key={sale.id}>
                            <td className="border px-4 py-2">{sale.id}</td>
                            <td className="border px-4 py-2">{sale.fecha}</td>
                            <td className="border px-4 py-2">{sale.product_names}</td>
                            <td className="border px-4 py-2">{sale.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Sales;
