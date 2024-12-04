import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad_en_stock: '',
        category_id: '',
    });
    const [filter, setFilter] = useState('id');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, client_id: localStorage.getItem('client_id') };
            if (!payload.nombre || !payload.precio || !payload.cantidad_en_stock || !payload.category_id || !payload.client_id) {
                throw new Error('Todos los campos son obligatorios.');
            }
            if (editingProduct) {
                await apiClient.put(`/products/${editingProduct.id}`, payload);
            } else {
                await apiClient.post('/products', payload);
            }
            fetchProducts();
            setForm({ nombre: '', descripcion: '', precio: '', cantidad_en_stock: '', category_id: '' });
            setEditingProduct(null);
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setForm(product);
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const handleSearch = () => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = products.filter((product) => {
            if (filter === 'id') {
                return product.id.toString().includes(lowercasedSearchTerm);
            } else if (filter === 'nombre') {
                return product.nombre.toLowerCase().includes(lowercasedSearchTerm);
            } else if (filter === 'descripcion') {
                return product.descripcion.toLowerCase().includes(lowercasedSearchTerm);
            } else if (filter === 'precio') {
                return product.precio.toString().includes(lowercasedSearchTerm);
            } else if (filter === 'cantidad') {
                return product.cantidad_en_stock.toString().includes(lowercasedSearchTerm);
            } else if (filter === 'categoria') {
                const category = categories.find((category) => category.id === product.category_id);
                return category ? category.nombre.toLowerCase().includes(lowercasedSearchTerm) : false;
            }
            return false;
        });
        setFilteredProducts(filtered);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

            {userRole === 'admin' && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={form.nombre}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="descripcion"
                            placeholder="Descripción"
                            value={form.descripcion}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="precio"
                            placeholder="Precio"
                            value={form.precio}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            name="cantidad_en_stock"
                            placeholder="Cantidad en Stock"
                            value={form.cantidad_en_stock}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        />
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                    >
                        {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                </form>
            )}

            <div className="mb-4">
                <label htmlFor="filter" className="mr-2">Filtrar por:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mr-2"
                >
                    <option value="id">ID</option>
                    <option value="nombre">Nombre</option>
                    <option value="descripcion">Descripción</option>
                    <option value="precio">Precio</option>
                    <option value="cantidad">Cantidad</option>
                    <option value="categoria">Categoría</option>
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
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Descripción</th>
                        <th className="px-4 py-2">Precio</th>
                        <th className="px-4 py-2">Cantidad</th>
                        <th className="px-4 py-2">Categoría</th>
                        {userRole === 'admin' && <th className="px-4 py-2">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <td className="border px-4 py-2">{product.id}</td>
                            <td className="border px-4 py-2">{product.nombre}</td>
                            <td className="border px-4 py-2">{product.descripcion}</td>
                            <td className="border px-4 py-2">{product.precio}</td>
                            <td className="border px-4 py-2">{product.cantidad_en_stock}</td>
                            <td className="border px-4 py-2">
                                {categories.find((category) => category.id === product.category_id)?.nombre || 'N/A'}
                            </td>
                            {userRole === 'admin' && (
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Products;
