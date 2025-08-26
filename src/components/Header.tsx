import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user } = useAppContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isUser = user?.role?.includes('user') || false;
  const isSupplier = user?.role?.includes('supplier') || false;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ href, children, onClick }: { href?: string; children: React.ReactNode; onClick?: () => void }) => {
    const active = href ? isActive(href) : false;
    const baseClasses = "px-3 py-2 rounded-lg font-medium transition-all duration-200 relative";
    const activeClasses = active 
      ? "text-amber-400 bg-amber-400/10 border border-amber-400/20" 
      : "text-white hover:text-amber-300 hover:bg-white/5";
    
    if (onClick) {
      return (
        <button 
          onClick={onClick}
          className={`${baseClasses} ${activeClasses}`}
        >
          {children}
        </button>
      );
    }
    
    return (
      <a 
        href={href}
        className={`${baseClasses} ${activeClasses}`}
      >
        {children}
      </a>
    );
  };

  return (
    <nav className="bg-black/80 backdrop-blur-sm border-b border-amber-400/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <a 
            href="/" 
            className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors duration-200"
          >
            Padellers
          </a>
        </div>

        <div className="flex items-center space-x-2">
          <NavLink href="/">
            <div className="flex items-center space-x-1">
              <span>Home</span>
            </div>
          </NavLink>

          {/* User-specific links */}
          {isUser && (
            <>
              <NavLink href="/orders">
                <div className="flex items-center space-x-1">
                  <span>Orders</span>
                </div>
              </NavLink>
              
              <NavLink href="/cart">
                <div className="flex items-center space-x-1">
                  <span>Cart</span>
                </div>
              </NavLink>
            </>
          )}

          {/* Supplier-specific links */}
          {isSupplier && (
            <>
              <NavLink href="/product/create">
                <div className="flex items-center space-x-1">
                  <span>Add Product</span>
                </div>
              </NavLink>
              
              <NavLink href="/supplier/orders">
                <div className="flex items-center space-x-1">
                  <span>Product Orders</span>
                </div>
              </NavLink>
            </>
          )}
        </div>

        {/* Right Navigation - Auth */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              {/* User indicator */}
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50">
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-amber-400 text-xs capitalize">
                    {isSupplier ? 'Supplier' : isUser ? 'Customer' : 'User'}
                  </p>
                </div>
              </div>
              
              <NavLink onClick={handleLogout}>
                <div className="flex items-center space-x-1">
                  <span>Logout</span>
                </div>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink href="/register">
                <div className="flex items-center space-x-1">
                  <span>Sign Up</span>
                </div>
              </NavLink>
              
              <NavLink href="/login">
                <div className="flex items-center space-x-1">
                  <span>Log In</span>
                </div>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;