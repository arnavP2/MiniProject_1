import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Package, ClipboardList, Check } from 'lucide-react';

const ArtisanDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState(null);

  useEffect(() => {
    if (user?.role !== 'artisan') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [prodRes, ordRes] = await Promise.all([
          api.get('/products/me'),
          api.get('/orders/shop')
        ]);
        setProducts(prodRes.data.data);
        // Filter orders meant for this artisan is no longer needed since shop endpoint does it
        setOrders(ordRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (tags) {
      tags.split(',').forEach(tag => formData.append('tags[]', tag.trim()));
    }
    if (images) {
      Array.from(images).forEach(file => formData.append('images', file));
    }

    try {
      const { data } = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProducts([...products, data.data]);
      // reset form
      setName(''); setDescription(''); setPrice(''); setTags(''); setImages(null);
      alert('Product added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o._id === orderId ? data.data : o));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Artisan Dashboard
          </h2>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`${activeTab === 'products' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Package className="h-4 w-4" /> My Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${activeTab === 'orders' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <ClipboardList className="h-4 w-4" /> Orders & Pickups
          </button>
        </nav>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-amber-600" /> Add New Product
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required rows="3" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" placeholder="e.g. pottery, handmade, clay" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none">
                Save Product
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <img src={product.images[0]?.url || 'https://via.placeholder.com/400'} alt={product.name} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                    <p className="mt-1 text-lg font-bold text-amber-600">₹{product.price}</p>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  You haven't added any products yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order._id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 truncate">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-900 mr-2">Items:</span>
                        {order.products.map((p, i) => <span key={i}>{p.product.name} (x{p.quantity})</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'Ready for Pickup' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                    {order.status === 'Pending' && (
                      <button onClick={() => updateOrderStatus(order._id, 'Processing')} className="text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-2 py-1 rounded">Accept Order</button>
                    )}
                    {order.status === 'Processing' && (
                      <button onClick={() => updateOrderStatus(order._id, 'Ready for Pickup')} className="text-xs bg-amber-600 text-white hover:bg-amber-700 px-2 py-1 rounded flex items-center gap-1"><Check className="h-3 w-3"/> Mark Ready for Pickup</button>
                    )}
                    {order.status === 'Ready for Pickup' && (
                      <button onClick={() => updateOrderStatus(order._id, 'Completed')} className="text-xs bg-green-600 text-white hover:bg-green-700 px-2 py-1 rounded">Mark Completed (Picked up)</button>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {orders.length === 0 && (
              <li className="px-4 py-8 text-center text-gray-500">No orders yet.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArtisanDashboard;
