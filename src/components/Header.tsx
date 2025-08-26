import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';

interface NavLinkProps {
  to?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ to, children, onClick, className = '' }: NavLinkProps) => {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;
  
  const baseClasses = "px-3 py-2 rounded-lg font-medium transition-all duration-200 relative";
  const activeClasses = isActive 
    ? "text-amber-400 bg-amber-400/10 border border-amber-400/20" 
    : "text-white hover:text-amber-300 hover:bg-white/5";
  
  const combinedClasses = `${baseClasses} ${activeClasses} ${className}`;
  
  if (onClick) {
    return (
      <button onClick={onClick} className={combinedClasses}>
        {children}
      </button>
    );
  }
  
  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    );
  }
  
  return null;
};

interface UserAvatarProps {
  user: { name: string; role: string };
  isSupplier: boolean;
  isUser: boolean;
}

const UserAvatar = ({ user, isSupplier, isUser }: UserAvatarProps) => (
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
);

const Header = () => {
  const { user } = useAppContext();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const isUser = user?.role?.includes('user') || false;
  const isSupplier = user?.role?.includes('supplier') || false;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-black/80 backdrop-blur-sm border-b border-amber-400/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors duration-200"
        >
          Padellers
        </Link>

        <div className="flex items-center space-x-2">
          <NavLink to="/">Home</NavLink>

          {/* User-specific links */}
          {isUser && (
            <>
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/cart">Cart</NavLink>
            </>
          )}

          {/* Supplier-specific links */}
          {isSupplier && (
            <>
              <NavLink to="/product/create">Add Product</NavLink>
              <NavLink to="/supplier/orders">Product Orders</NavLink>
            </>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <UserAvatar user={user} isSupplier={isSupplier} isUser={isUser} />
              <NavLink onClick={handleLogout}>Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/register">Sign Up</NavLink>
              <NavLink to="/login">Log In</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;