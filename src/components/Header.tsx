import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { CanAccess } from './common/CanAccess';
import { usePermissions } from '../hooks/usePermission';

const Header = () => {
  const { user } = useAppContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = usePermissions();

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

          <CanAccess permissions={['order.create', 'order.view']}>
            <NavLink href="/orders">Orders</NavLink>
            <NavLink href="/cart">Cart</NavLink>
          </CanAccess>

          <CanAccess permission="product.create">
            <NavLink href="/product/create">Add Product</NavLink>
          </CanAccess>

          <CanAccess permission="product.order.view" fallback={null}>
            {hasRole('supplier') && <NavLink href="/supplier/orders">Product Orders</NavLink>}
          </CanAccess>
        </div>

        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50">
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-amber-400 text-xs capitalize">
                    {hasRole('supplier') ? 'Supplier' : hasRole('user') ? 'Customer' : 'User'}
                  </p>
                </div>
              </div>
              <NavLink onClick={handleLogout}>Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink href="/register">Sign Up</NavLink>
              <NavLink href="/login">Log In</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;