import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount, isAuthenticated, logout, user } = useCart();

  return (
    <header className="bg-secondary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wider hover:text-accent transition-colors">
            Fresher's Cafe
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/#hero" className="hover:text-accent transition-colors font-medium">Home</a>
            <a href="/#about" className="hover:text-accent transition-colors font-medium">About</a>
            <a href="/#products" className="hover:text-accent transition-colors font-medium">Products</a>
            <a href="/#contact" className="hover:text-accent transition-colors font-medium">Contact</a>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-accent transition-colors font-medium">{user?.username || 'Profile'}</Link>
                <button onClick={logout} className="hover:text-accent transition-colors font-medium">Logout</button>
              </>
            ) : (
              <Link to="/login" className="hover:text-accent transition-colors font-medium">Sign In</Link>
            )}
          </nav>

          {/* Cart & Mobile Menu Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden hover:text-accent transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <a href="/#hero" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="/#about" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="/#products" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Products</a>
            <a href="/#contact" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>{user?.username || 'Profile'}</Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
