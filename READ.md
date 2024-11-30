Script para la creacion de la DB

-- Crear la base de datos
CREATE DATABASE MultiEmpresaInventory;
GO

-- Usar la base de datos creada
USE MultiEmpresaInventory;
GO

-- Crear la tabla de empresas
CREATE TABLE clients (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    direccion NVARCHAR(255),
    telefono NVARCHAR(50),
    email NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Crear la tabla de usuarios
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT NOT NULL,
    nombre NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    rol NVARCHAR(50) CHECK (rol IN ('admin', 'empleado')),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Crear la tabla de categorías
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT NOT NULL,
    nombre NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(500),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Crear la tabla de productos
CREATE TABLE products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT NOT NULL,
    nombre NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(500),
    precio DECIMAL(10, 2) NOT NULL,
    cantidad_en_stock INT NOT NULL DEFAULT 0,
    category_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Crear la tabla de ventas
CREATE TABLE sales (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT NOT NULL,
    user_id INT NOT NULL,
    fecha DATETIME DEFAULT GETDATE(),
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Crear la tabla de detalles de ventas
CREATE TABLE sale_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT NOT NULL,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Crear la tabla de ajustes de inventario
CREATE TABLE adjustments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT NOT NULL,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    fecha DATETIME DEFAULT GETDATE(),
    cantidad INT NOT NULL,
    motivo NVARCHAR(500) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

Instalación de dependencias

Backend:
Ve al directorio del backend y ejecuta:

npm install express jsonwebtoken bcrypt mssql dotenv cors body-parser

Frontend:
Ve al directorio del frontend y ejecuta:
npm install react react-dom react-router-dom axios tailwindcss