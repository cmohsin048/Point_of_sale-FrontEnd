import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import jwtDecode from 'jwt-decode';
import MenuItem from '@mui/material/MenuItem';

function SaleForm() {
  const storeId = useSelector((state) => state.auth.storeID);
  const [userRole, setUserRole] = useState('');
  const [store, setStore] = useState('');
  const [saleData, setSaleData] = useState({
    productName: '',
    price: '',
    quantity: '',
    productID: '', // Added productID field
    paymentMethod: '', // Added paymentMethod field
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [saleProducts, setSaleProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [storeList, setStoreList] = useState([]);

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductNameChange = (e) => {
    const name = e.target.value;

    const matchingProduct = products.find((product) => {
      const productName = product.Name.toLowerCase();
      return productName.includes(name.toLowerCase());
    });

    if (matchingProduct) {
      // Set the product name to what the employee is typing
      setSaleData((prevSaleData) => ({
        ...prevSaleData,
        productName: name,
        price: parseFloat(matchingProduct.price), // Parse the price here
        productID: matchingProduct.ProductID,
      }));
    } else {
      // Clear the price and productID fields when the product name is empty
      setSaleData((prevSaleData) => ({
        ...prevSaleData,
        productName: name,
        price: '', 
        productID: '', 
      }));
    }
  };

  const handleAddProductToSale = () => {
    const { productName, price, quantity, productID } = saleData;

    if (
      productName.trim() !== '' &&
      String(price).trim() !== '' &&
      String(quantity).trim() !== '' &&
      String(productID).trim() !== ''
    ) {
      const productToAdd = {
        productName: productName,
        price: price,
        quantity: quantity,
        productID: productID, // Make sure productID is correctly set
      };

      setSaleProducts([...saleProducts, productToAdd]);
      setTotalPrice(totalPrice + parseFloat(price) * parseInt(quantity));
      setSaleData({
        productName: '',
        price: '',
        quantity: '',
        productID: '',
        paymentMethod: saleData.paymentMethod, // Preserve payment method
      });
    } else {
      alert('Please fill in all product details (Product Name, Price, Quantity, Product ID)');
    }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      return;
    }
    // Calculate total amount
    const totalAmount = saleProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    // Prepare the data for the sale
    const saleToSubmit = {
      storeID: store || storeId, // Use selected store or user's storeID
      products: saleProducts.map((product) => ({
        productName: product.productName,
        price: product.price,
        quantity: product.quantity,
        productID: product.productID,
      })),
      totalAmount: totalAmount, // Include the totalAmount
      paymentMethod: saleData.paymentMethod, // Include payment method
    };

    try {
      // Send the sale data to the backend
      await axios.post('https://posbackend-4bid.onrender.com/store/addsale', saleToSubmit);

      // Handle the response from the server if needed
      alert('Sale Form Submitted');

      // Clear the form and sale data
      setSaleData({
        productName: '',
        price: '',
        quantity: '',
        productID: '',
        paymentMethod: '', // Reset payment method
      });
      setSaleProducts([]);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error submitting sale:', error);
    }
  };
    const checkLowQuantityProductsAlert = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();

    // Check if it's 10 am or 3 pm and it's a new day
    if ((hours === 10 || hours === 15) && isNewDay()) {
      const lowQuantityProducts = products.filter((product) => product.quantity < 30);

      if (lowQuantityProducts.length > 0) {
        let alertMessage = 'Low quantity products:\n';

        lowQuantityProducts.forEach((product) => {
          alertMessage += `Product Name: ${product.Name}, Quantity: ${product.quantity}\n`;
        });

        alert(alertMessage);
        markDayAsAlerted();
      }
    }
  };

  // Function to check if it's a new day (compared to the last alert date)
  const isNewDay = () => {
    const lastAlertDate = localStorage.getItem('lastAlertDate');
    const today = new Date().toLocaleDateString();

    return lastAlertDate !== today;
  };

  // Function to mark the current day as alerted
  const markDayAsAlerted = () => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem('lastAlertDate', today);
  };

  // Set up an interval to check for low quantity products
  useEffect(() => {
    const checkLowQuantityProductsInterval = setInterval(() => {
      checkLowQuantityProductsAlert();
    }, 1000 * 60); // Check every minute (adjust as needed)

    return () => {
      clearInterval(checkLowQuantityProductsInterval);
    };
  }, []);


  // Fetch products when the component is mounted
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          `https://posbackend-4bid.onrender.com/store/Allproducts?store=${store || storeId}` // Use selected store or user's storeID
        );

        if (!response.data || !Array.isArray(response.data)) {
          console.error('No products data received from the server.');
          return;
        }

        const fetchedProducts = response.data;
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, [store, storeId]);

  useEffect(() => {
    // Fetch userRole here (e.g., from your JWT)
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
      <h2>Sale Form</h2>
      {userRole === 'Admin' && (
        <FormControl fullWidth sx={{ mt: 3 ,width:300}}>
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
      <form onSubmit={handleSaleSubmit}>
        {saleProducts.map((product, index) => (
          <div className="upper" key={index}>
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
                name={`price${index}`}
                value={`$${product.price}`}
                readOnly
              />
            </label>
          </div>
        ))}
        <div className="upper">
          <label>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Product Name:"
              type="text"
              name="productName"
              className="form-input"
              value={saleData.productName}
              onChange={handleProductNameChange}
            />
          </label>
          <label>
            <TextField
              margin="normal"
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              className="form-input"
              value={saleData.quantity}
              onChange={handleSaleChange}
            />
          </label>
          <label>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Price:"
              type="number"
              name="price"
              className="form-input"
              value={saleData.price}
            />
          </label>

          {/* Hidden input field to store productID */}
          <input
            type="hidden"
            name="productID"
            className="form-input"
            value={saleData.productID}
          />
          <button type="button" className="add" onClick={handleAddProductToSale}>
            Add Product
          </button>
        </div>
        <div className="lower">
          <label>Total Price:</label>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <button type="submit" className="add">
          Submit Sale
        </button>
        
      </form>
      <FormControl fullWidth sx={{ mt: 3, width: 300 }}>
        <InputLabel htmlFor="paymentMethod">Payment Method</InputLabel>
        <Select
          label="Payment Method"
          name="paymentMethod"
          id="paymentMethod"
          required
          value={saleData.paymentMethod}
          onChange={(e) => handleSaleChange(e)}
        >
          <MenuItem value="creditCard">Credit Card</MenuItem>
          <MenuItem value="debitCard">Debit Card</MenuItem>
          <MenuItem value="cash">Cash</MenuItem>
          {/* Add other payment methods as needed */}
        </Select>
      </FormControl>
    </div>
  );
}

export default SaleForm;
