import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store, LogOut, User, MapPin } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-amber-600" />
              <span className="font-bold text-xl tracking-tight text-gray-900">ArtisanLocal</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'artisan' && (
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-amber-600"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-amber-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-amber-600 text-white hover:bg-amber-700 h-9 px-4 py-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
