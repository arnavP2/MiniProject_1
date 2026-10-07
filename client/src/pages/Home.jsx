import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { MapPin, Compass } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState('');
  
  useEffect(() => {
    const fetchProducts = async (lng, lat) => {
      try {
        let url = '/products';
        if (lng && lat) {
          url += `?lng=${lng}&lat=${lat}`;
        }
        const { data } = await api.get(url);
        setProducts(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchProducts(pos.coords.longitude, pos.coords.latitude);
        },
        (err) => {
          setLocationError('Location access denied. Showing all products.');
          fetchProducts(); // fetch without location (maybe backend handles this by returning all or failing, wait, backend requires lng/lat if geoNear is used. Let's check backend controller).
        }
      );
    } else {
      setLocationError('Geolocation not supported.');
      fetchProducts();
    }
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Compass className="h-8 w-8 text-amber-600" />
          Discover Local Artisans
        </h1>
      </div>
      
      {locationError && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-6 text-sm">
          {locationError}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found near you.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="group">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-amber-600">₹{product.price}</p>
                    {product.distance !== undefined && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {(product.distance / 1000).toFixed(1)} km
                      </p>
                    )}
                  </div>
                  <div className="mt-3 text-sm text-gray-600 border-t pt-3">
                    By <span className="font-medium">{product.artisanDetails?.artisanData?.shopName || product.artisan?.artisanData?.shopName || 'Unknown Shop'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
