import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderTracker from './pages/OrderTracker';
import ArtisanDashboard from './pages/ArtisanDashboard';
import ArtisanProfile from './pages/ArtisanProfile';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderTracker />} />
          <Route path="/dashboard" element={<ArtisanDashboard />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
