import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import RoutingMap from '../components/RoutingMap';
import { MapPin, CheckCircle, CreditCard, Banknote } from 'lucide-react';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [buyerLocation, setBuyerLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI QR');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const initCheckout = async () => {
      try {
        const res = await api.get(`/products`);
        const found = res.data.data.find(p => p._id === id);
        setProduct(found);

        // Get buyer location for routing
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => setBuyerLocation([pos.coords.longitude, pos.coords.latitude]),
            (err) => console.log('Location denied', err)
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initCheckout();
  }, [id, user, navigate]);

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      const artisan = product.artisanDetails || product.artisan;
      
      const orderData = {
        products: [
          {
            product: product._id,
            quantity: 1,
            price: product.price
          }
        ],
        artisan: artisan._id,
        totalAmount: product.price,
        paymentMethod
      };

      const { data } = await api.post('/orders', orderData);
      navigate(`/order/${data.data._id}`); // Redirect to order tracker
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
  if (!product) return <div className="text-center p-12">Product not found</div>;

  const artisan = product.artisanDetails || product.artisan;
  const artisanLocation = artisan?.location?.coordinates;
  const upiId = artisan?.artisanData?.upiId || 'test@upi';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${artisan?.artisanData?.shopName}&am=${product.price}&cu=INR`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete Self-Pickup Order</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
              <MapPin className="text-amber-600" /> Pickup Route
            </h2>
            <RoutingMap buyerLocation={buyerLocation} artisanLocation={artisanLocation} />
            {!buyerLocation && (
              <p className="mt-2 text-sm text-amber-600">Please allow location access to see the route.</p>
            )}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
              <p className="font-medium text-gray-900">Pickup Location:</p>
              <p>{artisan?.artisanData?.shopName}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'UPI QR' ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="UPI QR" checked={paymentMethod === 'UPI QR'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-amber-600 focus:ring-amber-500" />
                <div className="ml-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Zero-Fee UPI QR</span>
                </div>
              </label>
              
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Cash' ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" value="Cash" checked={paymentMethod === 'Cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-amber-600 focus:ring-amber-500" />
                <div className="ml-3 flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Cash on Pickup</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'UPI QR' && (
              <div className="mt-6 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-900 mb-4">Scan with any UPI App (GPay, PhonePe, Paytm)</p>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <QRCodeSVG value={upiUrl} size={150} level="H" />
                </div>
                <p className="mt-4 text-xs text-gray-500 text-center">Amount: ₹{product.price}<br/>Paying to: {upiId}</p>
                <p className="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Zero transaction fees. 100% goes to the artisan.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="flex items-center gap-4 py-4 border-b border-gray-100">
              <img src={product.images[0]?.url} alt="" className="h-16 w-16 object-cover rounded-md" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">Qty: 1</p>
              </div>
              <p className="ml-auto text-sm font-medium text-gray-900">₹{product.price}</p>
            </div>
            
            <dl className="space-y-4 py-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-gray-900">₹{product.price}</dd>
              </div>
              <div className="flex justify-between text-green-600">
                <dt>Delivery Fee</dt>
                <dd className="font-medium">₹0.00 (Self-Pickup)</dd>
              </div>
              <div className="flex justify-between text-green-600">
                <dt>Platform Fee</dt>
                <dd className="font-medium">₹0.00</dd>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-xl font-bold text-amber-600">₹{product.price}</dd>
              </div>
            </dl>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {placingOrder ? 'Confirming...' : 'Confirm Order & Prepare Pickup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
