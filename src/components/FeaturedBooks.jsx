import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaHeart, 
  FaRegHeart, 
  FaExternalLinkAlt,
  FaShoppingCart,
  FaStar,
  FaArrowRight, 
  FaArrowLeft
} from "react-icons/fa";
import noCover from "../images/NoImage.svg";
import Loading from "./Loading";
import { getLocalStorage, setLocalStorage } from "../utils/storage";

export default function FeaturedBooks({ toggleFavorite, addToCart }) {
  const featuredCategories = [
    { name: "Best Sellers", query: "bestsellers" },
    { name: "New Releases", query: "new+releases" },
    { name: "Award Winners", query: "award+winners" },
  ];
  
  const [activeCategory, setActiveCategory] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [hoveredBook, setHoveredBook] = useState(null);

  // Load from localStorage on component mount
  useEffect(() => {
    const storedFavorites = getLocalStorage('favorites') || [];
    setFavorites(storedFavorites);
  }, []);

  const handleToggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    setLocalStorage('favorites', newFavorites);
    if (toggleFavorite) toggleFavorite(id);
  };

  const handleAddToCart = (item) => {
    const cartItems = getLocalStorage('cart') || [];
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    let newCart;
    if (existingItemIndex >= 0) {
      newCart = [...cartItems];
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart = [...cartItems, { ...item, quantity: 1 }];
    }
    
    setLocalStorage('cart', newCart);
    if (addToCart) addToCart(item);
  };

  const openModal = (bookDetails, bookId) => {
    setSelectedBook({...bookDetails, id: bookId});
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedBook(null);
    document.body.style.overflow = 'auto';
  };

  const generatePrice = (id) => {
    const basePrice = (id.charCodeAt(0) % 26) + 5;
    return (basePrice + 0.99).toFixed(2);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${featuredCategories[activeCategory].query}&maxResults=8&key=AIzaSyDaLzmtMXyLkRnXJzGuxjkRfYJGYpmrqFM`
        );
        setBooks(res.data.items || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [activeCategory]);

  const nextCategory = () => {
    setActiveCategory((prev) => (prev + 1) % featuredCategories.length);
  };

  const prevCategory = () => {
    setActiveCategory((prev) => (prev - 1 + featuredCategories.length) % featuredCategories.length);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-indigo-600">Featured</span> Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover curated collections of must-read titles across various genres
          </p>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex justify-center items-center mb-8">
          <button 
            onClick={prevCategory}
            className="p-3 rounded-full bg-white shadow-md mr-4 hover:bg-gray-100 transition hover:scale-110"
            disabled={loading}
            aria-label="Previous category"
          >
            <FaArrowLeft className="text-indigo-600 text-lg" />
          </button>
          
          <div className="flex overflow-x-auto py-2 space-x-2 scrollbar-hide">
            {featuredCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                disabled={loading}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === index 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
                } transition min-w-[120px]`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <button 
            onClick={nextCategory}
            className="p-3 rounded-full bg-white shadow-md ml-4 hover:bg-gray-100 transition hover:scale-110"
            disabled={loading}
            aria-label="Next category"
          >
            <FaArrowRight className="text-indigo-600 text-lg" />
          </button>
        </div>

        {/* Loading State */}
        {loading && <Loading />}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && (
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => {
                  const { volumeInfo, id } = book;
                  const isFavorite = favorites.includes(id);
                  const price = generatePrice(id);

                  return (
                    <motion.div
                      key={id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="group relative"
                    >
                      {/* Book Cover with 3D Effect */}
                      <div 
                        className="relative w-[180px] h-[250px] mx-auto mb-6 perspective-1000 cursor-pointer"
                        onMouseEnter={() => setHoveredBook(id)}
                        onMouseLeave={() => setHoveredBook(null)}
                        onClick={() => openModal(volumeInfo, id)}
                      >
                        {/* Book Cover */}
                        <motion.div 
                          className={`absolute top-0 left-2 w-full h-full bg-white rounded-r-sm shadow-lg transition-transform duration-300 ${hoveredBook === id ? 'transform -translate-y-1 rotate-2' : ''}`}
                          style={{ transformOrigin: 'left center' }}
                        >
                          <div className="relative w-full h-full overflow-hidden rounded-r-sm">
                            <img
                              alt={volumeInfo.title || "Book cover"}
                              src={volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || noCover}
                              className="h-full w-full object-cover"
                            />
                            
                            {/* Hover Overlay */}
                            {hoveredBook === id && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(volumeInfo, id);
                                  }}
                                  className="px-4 py-1.5 bg-white text-indigo-600 text-sm font-medium rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all"
                                >
                                  Quick View
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                        
                        {/* Book Pages Effect */}
                        <div className="absolute top-0 left-0 w-full h-full">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-r-sm"
                              style={{
                                transform: `translateX(${i * 0.5}px) translateY(${i * 0.5}px)`,
                                zIndex: -i - 1,
                                opacity: 1 - (i * 0.15)
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow mt-[-30px] pt-8">
                        {/* Favorite Button */}
                        <div className="absolute -top-4 right-4 flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(id);
                            }}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-red-100 transition-colors"
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            {isFavorite ? (
                              <FaHeart className="text-red-500" />
                            ) : (
                              <FaRegHeart className="text-gray-600 hover:text-red-500" />
                            )}
                          </button>
                        </div>

                        <div className="p-1">
                          {/* Categories */}
                          {volumeInfo.categories?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {volumeInfo.categories.slice(0, 2).map((category) => (
                                <span
                                  key={category}
                                  className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                                >
                                  {category.split('/')[0]}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 h-14">
                            {volumeInfo.title || "Untitled"}
                          </h3>

                          {/* Author */}
                          {volumeInfo.authors?.length > 0 && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                              by {volumeInfo.authors.join(", ")}
                            </p>
                          )}

                          {/* Rating */}
                          <div className="mt-2 flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={`${i < Math.floor(volumeInfo.averageRating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              ({volumeInfo.ratingsCount || 0})
                            </span>
                          </div>

                          {/* Price and Add to Cart */}
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-lg font-bold text-indigo-600">${price}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart({
                                  id,
                                  title: volumeInfo.title,
                                  price,
                                  image: volumeInfo.imageLinks?.thumbnail || noCover
                                });
                              }}
                              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700 transition flex items-center"
                            >
                              <FaShoppingCart className="mr-1" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No books found in this category.</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Book Cover with 3D Effect */}
                  <div className="flex-shrink-0 w-full md:w-1/3">
                    <div className="relative w-full h-[350px] perspective-1000">
                      {/* Book Cover */}
                      <div className="absolute top-0 left-3 w-full h-full bg-white rounded-r-lg shadow-xl">
                        <div className="relative w-full h-full overflow-hidden rounded-r-lg">
                          <img
                            alt={selectedBook.title || "Book cover"}
                            src={
                              selectedBook.imageLinks?.thumbnail ||
                              selectedBook.imageLinks?.smallThumbnail ||
                              noCover
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Book Pages Effect */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-r-lg"
                            style={{
                              transform: `translateX(${i * 1}px) translateY(${i * 1}px)`,
                              zIndex: -i - 1,
                              opacity: 1 - (i * 0.1)
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Price and Add to Cart */}
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-indigo-600">${generatePrice(selectedBook.id)}</span>
                        {selectedBook.pageCount && (
                          <span className="text-sm text-gray-500 ml-2">• {selectedBook.pageCount} pages</span>
                        )}
                      </div>
                      <button 
                        onClick={() => {
                          handleAddToCart({
                            id: selectedBook.id,
                            title: selectedBook.title,
                            price: generatePrice(selectedBook.id),
                            image: selectedBook.imageLinks?.thumbnail || noCover
                          });
                          closeModal();
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
                      >
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {selectedBook.title}
                        </h2>
                        {selectedBook.subtitle && (
                          <p className="text-lg text-gray-600 mt-1">
                            {selectedBook.subtitle}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleToggleFavorite(selectedBook.id)}
                        className="p-6 rounded-full  transition-colors"
                        aria-label={favorites.includes(selectedBook.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(selectedBook.id) ? (
                          <FaHeart className="text-red-500 text-xl" />
                        ) : (
                          <FaRegHeart className="text-gray-600 hover:text-red-500 text-xl" />
                        )}
                      </button>
                    </div>

                    {/* Authors */}
                    {selectedBook.authors?.length > 0 && (
                      <p className="mt-3 text-lg text-gray-700">
                        <span className="font-medium">By:</span> {selectedBook.authors.join(", ")}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="mt-2 flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < Math.floor(selectedBook.averageRating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {selectedBook.averageRating || 'No'} rating ({selectedBook.ratingsCount || '0'} reviews)
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {selectedBook.publisher && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Publisher</h4>
                          <p className="text-gray-700">{selectedBook.publisher}</p>
                        </div>
                      )}
                      {selectedBook.publishedDate && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Published</h4>
                          <p className="text-gray-700">
                            {new Date(selectedBook.publishedDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {selectedBook.language && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Language</h4>
                          <p className="text-gray-700">{selectedBook.language.toUpperCase()}</p>
                        </div>
                      )}
                      {selectedBook.categories?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Genre</h4>
                          <p className="text-gray-700">{selectedBook.categories[0]}</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {selectedBook.description && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 whitespace-pre-line">
                          {selectedBook.description.length > 500
                            ? `${selectedBook.description.substring(0, 500)}...`
                            : selectedBook.description}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4">
                      {selectedBook.infoLink && (
                        <a
                          href={selectedBook.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                          <span>View on Google Books</span>
                          <FaExternalLinkAlt className="ml-2" />
                        </a>
                      )}
                      {selectedBook.previewLink && (
                        <a
                          href={selectedBook.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <span>Read Preview</span>
                          <FaExternalLinkAlt className="ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}