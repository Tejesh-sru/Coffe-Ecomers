import { useCart } from '../context/CartContext';

const products = [
  { id: 1, name: 'Black Coffee', price: 4.99, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', description: 'Rich and bold classic coffee' },
  { id: 2, name: 'Espresso', price: 5.99, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', description: 'Strong and concentrated coffee shot' },
  { id: 3, name: 'Cappuccino', price: 6.99, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400', description: 'Espresso with steamed milk foam' },
  { id: 4, name: 'Latte', price: 6.49, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', description: 'Smooth espresso with steamed milk' },
  { id: 5, name: 'Mocha', price: 7.49, image: 'https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=400', description: 'Coffee with chocolate and milk' },
  { id: 6, name: 'Americano', price: 4.99, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', description: 'Espresso diluted with hot water' },
  { id: 7, name: 'Macchiato', price: 5.49, image: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400', description: 'Espresso with a dollop of foam' },
  { id: 8, name: 'Flat White', price: 6.99, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', description: 'Velvety microfoam latte' },
];

const Home = () => {
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      alert(error.message || 'Failed to add item to cart');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="relative h-screen bg-gradient-to-r from-secondary to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600')] bg-cover bg-center opacity-30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              FRESH COFFEE IN THE MORNING
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Experience the perfect blend of quality and taste with every cup
            </p>
            <a href="#products" className="btn-primary inline-block">
              Explore Our Menu
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-secondary">About Us</h2>
              <h3 className="text-3xl font-semibold text-accent">A little cup of happiness.</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to <strong>Fresher's Cafe</strong>! We are passionate about crafting 
                delicious coffee from high-quality, ethically sourced beans. Our goal is to 
                bring you a fresh and flavorful cup, every time.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're grabbing a quick coffee on the go or looking to relax with 
                your favorite brew, we're here to make your coffee experience special. 
                Thank you for being part of our journey!
              </p>
              <button className="btn-primary">Learn More</button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800" 
                alt="Coffee and beans" 
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-secondary mb-4">Our Products</h2>
            <p className="text-xl text-gray-600">Discover our premium coffee selection</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="card group">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-secondary">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">Get In Touch</h2>
            <p className="text-xl text-gray-300 mb-12">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="input-field bg-gray-800 text-white placeholder-gray-400"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="input-field bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
              <textarea 
                placeholder="Your Message" 
                rows="5" 
                className="input-field bg-gray-800 text-white placeholder-gray-400"
              ></textarea>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
