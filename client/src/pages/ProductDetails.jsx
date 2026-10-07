import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import { Store, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products`); // Assuming no single product route, or wait, I need to fetch all and filter or check if single route exists.
        // Let's assume I need to fetch all and filter for now if there is no single GET.
        // Let's try fetching just in case.
        const res = await api.get(`/products`);
        const found = res.data.data.find(p => p._id === id);
        setProduct(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>;
  if (!product) return <div className="text-center p-12">Product not found</div>;

  const artisan = product.artisanDetails || product.artisan;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <img
              className="h-96 w-full object-cover md:h-full"
              src={product.images[0]?.url || 'https://via.placeholder.com/600'}
              alt={product.name}
            />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-2xl font-bold text-amber-600">₹{product.price}</p>
              </div>
              <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags?.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 text-gray-500 uppercase tracking-wider">Made By</h3>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Store className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">{artisan?.artisanData?.shopName}</p>
                    <Link to={`/artisan/${artisan?._id}`} className="text-sm text-amber-600 hover:text-amber-700 font-medium">View Maker Profile</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate(`/checkout/${product._id}`)}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Initiate Self-Pickup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
