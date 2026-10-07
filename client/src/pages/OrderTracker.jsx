import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { Package, Clock, CheckCircle, Navigation } from 'lucide-react';

const OrderTracker = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        const found = data.data.find(o => o._id === id);
        setOrder(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
  if (!order) return <div className="text-center p-12">Order not found</div>;

  const statuses = ['Pending', 'Processing', 'Ready for Pickup', 'Completed'];
  const currentStatusIdx = statuses.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-amber-50">
          <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="mt-2 text-sm text-amber-800">Please prepare for self-pickup.</p>
        </div>

        <div className="p-8">
          <div className="relative pb-12">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="h-0.5 w-full bg-gray-200"></div>
            </div>
            <ul className="relative flex justify-between">
              {statuses.map((status, idx) => (
                <li key={status} className="flex flex-col items-center">
                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${idx <= currentStatusIdx ? 'bg-amber-600' : 'bg-gray-200'} ring-4 ring-white`}>
                    {idx < currentStatusIdx ? <CheckCircle className="h-5 w-5 text-white" /> : <Clock className={`h-4 w-4 ${idx === currentStatusIdx ? 'text-white' : 'text-gray-500'}`} />}
                  </div>
                  <span className={`absolute top-10 text-xs font-medium ${idx <= currentStatusIdx ? 'text-amber-600' : 'text-gray-500'}`}>{status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pickup Instructions</h3>
            <p className="text-sm text-gray-600">Your order will be ready at: <span className="font-medium text-gray-900">{order.artisan?.artisanData?.shopName}</span></p>
            {order.status === 'Ready for Pickup' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Your items are ready!</h4>
                  <p className="text-sm text-green-700 mt-1">Head to the shop to pick up your order. Mention your order number.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/" className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1">
               Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
