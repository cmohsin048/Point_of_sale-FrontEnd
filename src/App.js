import './App.css';
import SignIn from './components/signin';
import Admindashboard from './components/Admindashboard';
import Register from './components/Register';
import AddProduct from './components/AddProduct';
import Navbar from './components/Navbar';
import Sale from './components/Sale';
import Purchase from './components/Purchase';
import 'bootstrap/dist/css/bootstrap.min.css';
import Addstore from './components/Addstore';
import ManagerDashboard from './components/ManagerDashboard';
import Employeedashboard from './components/Employeedashboard';
import AddExpense from './components/Addexpense';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { setLoggedIn, setLoggedOut } from './reducer/Authslice';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (loggedIn) {
      dispatch(setLoggedIn());
    } else {
      dispatch(setLoggedOut());

    }
  }, [dispatch]);

  

  return (
    <div className="App">
      <Router>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/Admindashboard" /> : <SignIn />}
          />
          {isLoggedIn && (
            <>
              <Route path="/Admindashboard" element={<Admindashboard />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Addproduct" element={<AddProduct />} />
              <Route path="/Addstore" element={<Addstore />} />
              <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
              <Route path="/Employeedashboard" element={<Employeedashboard />} />
              <Route path="/Sale" element={<Sale />} />
              <Route path="/Purchase" element={<Purchase />} />
              <Route path="/addExpenses" element={<AddExpense />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
