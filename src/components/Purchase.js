import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import jwtDecode from 'jwt-decode';

function PurchaseForm() {
  const storeId = useSelector((state) => state.auth.storeID);
  const [userRole, setUserRole] = useState('');
  const [store, setStore] = useState('');
  const [purchaseData, setPurchaseData] = useState({
    productName: '',
    quantity: '',
    productID: '',
    purchasePrice: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [purchaseProducts, setPurchaseProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductNameChange = (e) => {
    const selectedProductName = e.target.value;

    const matchingProduct = products.find((product) => {
      const productName = product.Name.toLowerCase();
      return productName.includes(selectedProductName.toLowerCase());
    });

    if (matchingProduct) {
      setSelectedProduct(selectedProductName);
      setPurchaseData((prevPurchaseData) => ({
        ...prevPurchaseData,
        productName: selectedProductName,
        productID: matchingProduct.ProductID,
        // Ensure this is being set correctly
      }));
    } else {
      setSelectedProduct('');
      setPurchaseData((prevPurchaseData) => ({
        ...prevPurchaseData,
        productName: selectedProductName,
        productID: '',
      
      }));
    }
  };


  const handleAddProductToPurchase = () => {
    const { productName, quantity, productID, purchasePrice } = purchaseData;

    if (
      productName.trim() !== '' &&
      String(quantity).trim() !== '' &&
      String(productID).trim() !== '' &&
      String(purchasePrice).trim() !== ''
    ) {

      const producttoAdd = {
        productName: productName,
        quantity: quantity,
        productID: productID,
        purchasePrice: purchasePrice
      }



      setPurchaseProducts([...purchaseProducts, producttoAdd])
      setTotalAmount(totalAmount + parseFloat(purchasePrice) * parseInt(quantity));
      setPurchaseData({
        productName: '',
        quantity: '',
        productID: '',
        purchasePrice: '',
      });

      setSelectedProduct('');
    } else {
      alert(
        'Please fill in all product details (Product Name, Quantity, Product ID, Purchase Price)'
      );
    }
  };




  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();

    const purchaseToSubmit = {
      storeID: store || storeId,
      products: purchaseProducts.map((product) => ({
        productName: product.productName,
        quantity: product.quantity,
        productID: product.productID,
        purchasePrice: product.purchasePrice,
      })),
      totalAmount: totalAmount,
    };

    try {
      await axios.post('https://posbackend-4bid.onrender.com/store/addpurchase', purchaseToSubmit);

      alert('Purchase Form Submitted');

      setPurchaseData({
        productName: '',
        quantity: '',
        productID: '',
        purchasePrice: '',
      });
      setPurchaseProducts([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error submitting purchase:', error);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          `https://posbackend-4bid.onrender.com/store/Allproducts?store=${store || storeId}`
        );

        if (!response.data || !Array.isArray(response.data)) {
          console.error('No products data received from the server.');
          return;
        }

        const fetchedProducts = response.data;
        setProducts(fetchedProducts);
      } catch (error) {
        // console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, [store, storeId]);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    const decoded = jwtDecode(jwt);
    const userRole = decoded.role;
    setUserRole(userRole);
  }, []);

  useEffect(() => {
    axios
      .get('https://posbackend-4bid.onrender.com/store/Locations')
      .then((response) => {
        setStoreList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Purchase Form</h2>
      {userRole === 'Admin' && (
        <FormControl fullWidth sx={{ mt: 3, width: 300 }}>
          <InputLabel htmlFor="store">Select Store</InputLabel>
          <Select
            label="Select Store"
            name="store"
            id="store"
            required
            value={store}
            onChange={(e) => setStore(e.target.value)}
          >
            {storeList.map((storeOption) => (
              <MenuItem
                className="check"
                key={storeOption.storeID}
                value={storeOption.storeID}
              >
                {storeOption.address} - {storeOption.city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <form onSubmit={handlePurchaseSubmit}>
        {purchaseProducts.map((product, index) => (
          <div className="upper" key={index} >
            <label>
              <input
                type="text"
                className="form-input"
                name={`productName${index}`}
                value={product.productName}
                readOnly
              />
            </label>
            <label>
              <input
                type="number"
                className="form-input"
                name={`quantity${index}`}
                value={product.quantity}
                readOnly
              />
            </label>
            <label>
              <input
                className="form-input"
                type="text"
                name={`purchasePrice${index}`}
                value={`$${product.purchasePrice}`}
                readOnly
              />
            </label>
          </div>
        ))}
        <div className="upper">
          <label>
            <FormControl fullWidth sx={{ mt: 1 ,marginTop:1}}>
              <InputLabel htmlFor="product">Product Name</InputLabel>
              <Select
                className='selectproduct'
                label="Product Name"
                name="product"
                id="product"
                value={selectedProduct}
                onChange={handleProductNameChange}
              
              >
                {products.map((productOption) => (
                  <MenuItem
                    key={productOption.ProductID}
                    value={productOption.Name}
                  >
                    {productOption.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </label>
          <label>
            <TextField
              margin="normal"
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              className="form-input"
              value={purchaseData.quantity}
              onChange={handlePurchaseChange}
            />
          </label>
          <label>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Purchase Price"
              type="number"
              name="purchasePrice"
              className="form-input"
              value={purchaseData.purchasePrice}
              onChange={handlePurchaseChange}
            />

          </label>
          <input
            type="hidden"
            name="productID"
            className="form-input"
            value={purchaseData.productID}
          />
          <button
            type="button"
            className="add"
            onClick={handleAddProductToPurchase}
          >
            Add Product
          </button>
        </div>
        <div className="lower">
          <label>Total Amount:</label>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <button type="submit" className="add">
          Submit Purchase
        </button>
      </form>
    </div>
  );
}

export default PurchaseForm;
