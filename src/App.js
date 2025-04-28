import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './App.css';
import 'C:/Users/manoj/OneDrive/Desktop/Documents/gidy 2/inventory-frontend/src/App.css';

const App = () => {
  const [product, setProduct] = useState({ name: '', price: '', quantity: '' });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products
  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const result = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(result);
  }, [searchQuery, products]);

  // Handle submit
  const handleSubmit = () => {
    if (editMode) {
      axios.put(`http://localhost:5000/api/update-product/${editProductId}`, product)
        .then(() => {
          fetchProducts();
          setProduct({ name: '', price: '', quantity: '' });
          setEditMode(false);
          setEditProductId(null);
          setSearchQuery('');
        })
        .catch(error => console.error('Error updating product:', error));
    } else {
      axios.post('http://localhost:5000/api/add-product', product)
        .then(() => {
          fetchProducts();
          setProduct({ name: '', price: '', quantity: '' });
          setSearchQuery('');
        })
        .catch(error => console.error('Error adding product:', error));
    }
  };

  // Handle edit
  const handleEdit = (id) => {
    const productToEdit = products.find(product => product._id === id);
    setProduct({
      name: productToEdit.name,
      price: productToEdit.price,
      quantity: productToEdit.quantity
    });
    setEditMode(true);
    setEditProductId(id);
  };

  // Handle delete
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/delete-product/${id}`)
      .then(() => {
        fetchProducts();
        console.log('Product deleted successfully');
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  return (
    <div className="app-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="product-form">
        <input
          type="text"
          placeholder="Product name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={product.quantity}
          onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
        />
        <button onClick={handleSubmit}>
          {editMode ? 'Update Product' : 'Add Product'}
        </button>
      </div>

      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-item">
            <span>{product.name}</span>
            <span>{product.price}</span>
            <span>{product.quantity}</span>
            <button onClick={() => handleEdit(product._id)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
