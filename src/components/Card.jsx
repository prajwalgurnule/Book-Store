import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  FaHeart, 
  FaRegHeart, 
  FaExternalLinkAlt,
  FaShoppingCart,
  FaStar,
  FaBookOpen,
  FaBookmark
} from "react-icons/fa";
import noCover from "../images/NoImage.svg";
import { getLocalStorage, setLocalStorage } from "../utils/storage";

const colorGradients = [
  "from-pink-500/10 via-purple-500/10 to-blue-500/10",
  "from-yellow-500/10 via-amber-500/10 to-orange-500/10",
  "from-green-500/10 via-emerald-500/10 to-teal-500/10",
  "from-blue-500/10 via-indigo-500/10 to-violet-500/10",
  "from-purple-500/10 via-fuchsia-500/10 to-pink-500/10",
  "from-red-500/10 via-rose-500/10 to-pink-500/10",
  "from-indigo-500/10 via-blue-500/10 to-cyan-500/10",
  "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
  "from-orange-500/10 via-amber-500/10 to-yellow-500/10",
  "from-cyan-500/10 via-sky-500/10 to-blue-500/10",
  "from-lime-500/10 via-green-500/10 to-emerald-500/10",
  "from-rose-500/10 via-pink-500/10 to-fuchsia-500/10",
];

const shimmerVariants = {
  initial: { x: "-100%" },
  animate: { 
    x: "100%",
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export default function Card({ book, toggleFavorite, addToCart }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [hoveredBook, setHoveredBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedFavorites = getLocalStorage('favorites') || [];
    const storedSaved = getLocalStorage('saved') || [];
    setFavorites(storedFavorites);
    setSaved(storedSaved);
    
    // Simulate loading delay for animation
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
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

  const getRandomGradient = (id) => {
    const index = (id.charCodeAt(0) + (id.charCodeAt(id.length - 1) || 0)) % colorGradients.length;
    return colorGradients[index];
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "backOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        type: "spring",
        damping: 20,
        stiffness: 400
      }
    },
    exit: { opacity: 0, scale: 0.95 }
  };

  const bookCoverVariants = {
    initial: { rotateY: 0, rotateX: 0 },
    hover: { 
      rotateY: 15,
      rotateX: 5,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <div >
        <div className="mx-auto max-w-9xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {book.map((item) => {
              const { volumeInfo, id } = item;
              const isFavorite = favorites.includes(id);
              const isSaved = saved.includes(id);
              const price = generatePrice(id);
              const gradient = getRandomGradient(id);

              return (
                <motion.div
                  key={id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="group relative"
                >
                  {/* Shimmer Effect on Hover */}
                  <motion.div 
                    className="absolute inset-0 overflow-hidden rounded-xl"
                    initial="initial"
                    whileHover="animate"
                  >
                    <motion.div
                      className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      variants={shimmerVariants}
                    />
                  </motion.div>
                  
                  {/* Colorful Background */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Book Container */}
                  <div className="relative p-4 h-full">
                    {/* Book Cover with 3D Effect */}
                    <motion.div 
                      className="relative w-[200px] h-[240px] mx-auto mb-9 perspective-1000 cursor-pointer"
                      onMouseEnter={() => setHoveredBook(id)}
                      onMouseLeave={() => setHoveredBook(null)}
                      onClick={() => openModal(volumeInfo, id)}
                      variants={floatingVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <motion.div 
                        className="absolute top-0 left-2 w-full h-full bg-white rounded-r-sm shadow-xl"
                        variants={bookCoverVariants}
                        initial="initial"
                        whileHover="hover"
                        style={{ transformOrigin: 'left center' }}
                      >
                        <div className="relative w-full h-full overflow-hidden rounded-r-sm">
                          {isLoading ? (
                            <div className="h-full w-full bg-gray-200 animate-pulse"></div>
                          ) : (
                            <>
                              <img
                                alt={volumeInfo.title || "Book cover"}
                                src={volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || noCover}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              {/* Glossy Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10"></div>
                              
                              {/* Hover Overlay */}
                              {hoveredBook === id && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="absolute inset-0 bg-black/30 flex items-center justify-center"
                                >
                                  <motion.button
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openModal(volumeInfo, id);
                                    }}
                                    className="px-4 py-1.5 bg-white text-indigo-600 text-sm font-medium rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all"
                                  >
                                    Quick View
                                  </motion.button>
                                </motion.div>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                      
                      {/* Book Spine */}
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-l-sm shadow-lg"></div>
                      
                      {/* Book Pages Effect */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        {[...Array(5)].map((_, i) => (
                          <motion.div 
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
                    </motion.div>

                    {/* Book Info */}
                    <motion.div 
                      className="relative bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 mt-[-30px] pt-8 border border-white/20"
                      whileHover={{ y: -5 }}
                    >
                      {/* Favorite Button */}
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(id);
                        }}
                        className="absolute -top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition-colors z-10"
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isFavorite ? (
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <FaHeart className="text-red-500" />
                          </motion.div>
                        ) : (
                          <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                        )}
                      </motion.button>

                      {/* Save for Later Button */}
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSaved = saved.includes(id)
                            ? saved.filter(savedId => savedId !== id)
                            : [...saved, id];
                          setSaved(newSaved);
                          setLocalStorage('saved', newSaved);
                        }}
                        className="absolute -top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-indigo-100 transition-colors z-10"
                        aria-label={isSaved ? "Remove from saved" : "Save for later"}
                      >
                        <FaBookmark className={`${isSaved ? 'text-indigo-600 fill-current' : 'text-gray-600 hover:text-indigo-600'}`} />
                      </motion.button>

                      <div className="p-1">
                        {/* Categories */}
                        {volumeInfo.categories?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {volumeInfo.categories.slice(0, 2).map((category) => (
                              <motion.span
                                key={category}
                                whileHover={{ scale: 1.05 }}
                                className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full"
                              >
                                {category.split('/')[0]}
                              </motion.span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <motion.h3 
                          whileHover={{ color: "#4f46e5" }}
                          className="text-lg font-bold text-gray-900 line-clamp-2 h-14"
                          onClick={(e) => {
                                      e.stopPropagation();
                                      openModal(volumeInfo, id);
                                    }}
                        >
                          {volumeInfo.title || "Untitled"}
                        </motion.h3>

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
                              <motion.div 
                                key={i} 
                                whileHover={{ scale: 1.2 }}
                              >
                                <FaStar 
                                  className={`${i < Math.floor(volumeInfo.averageRating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                                />
                              </motion.div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({volumeInfo.ratingsCount || 0})
                          </span>
                        </div>

                        {/* Price and Add to Cart */}
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-lg font-bold text-indigo-600">${price}</span>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart({
                                id,
                                title: volumeInfo.title,
                                price,
                                image: volumeInfo.imageLinks?.thumbnail || noCover
                              });
                            }}
                            className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-lg"
                          >
                            <FaShoppingCart className="mr-1" /> Add
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        {/* Floating Books Animation */}
      <div className="hidden lg:block">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + (i * 15)}%`,
              rotate: `${-10 + Math.random() * 20}deg`
            }}
            className="absolute text-indigo-600 opacity-70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </motion.div>
        ))}
      </div> 
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10 shadow-md"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Book Cover with 3D Effect */}
                  <div className="flex-shrink-0 w-full md:w-1/3">
                    <motion.div 
                      className="relative w-full h-[350px] perspective-1000"
                      whileHover={{ y: -5 }}
                    >
                      {/* Book Cover */}
                      <motion.div 
                        className="absolute top-0 left-3 w-full h-full bg-white rounded-r-lg shadow-2xl"
                        whileHover={{ rotateY: 15, rotateX: 5 }}
                        transition={{ duration: 0.5 }}
                        style={{ transformOrigin: 'left center' }}
                      >
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
                          {/* Glossy Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10"></div>
                        </div>
                      </motion.div>
                      
                      {/* Book Spine */}
                      {/* <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-l-lg shadow-lg"></div>
                       */}
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
                    </motion.div>
                    
                    {/* Price and Add to Cart */}
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-indigo-600">${generatePrice(selectedBook.id)}</span>
                        
                      </div>
                      {selectedBook.pageCount && (
                          <span className="text-sm text-gray-500 ml-2">• {selectedBook.pageCount} pages</span>
                        )}
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleAddToCart({
                            id: selectedBook.id,
                            title: selectedBook.title,
                            price: generatePrice(selectedBook.id),
                            image: selectedBook.imageLinks?.thumbnail || noCover
                          });
                          closeModal();
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-lg"
                      >
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </motion.button>
                    </div>

                    {/* Quick Action */}
                    <div className="mt-4 flex gap-20">
                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleFavorite(selectedBook.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
                          favorites.includes(selectedBook.id)
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'
                        }`}
                      >
                        {favorites.includes(selectedBook.id) ? (
                          <>
                            <FaHeart className="text-red-500" />
                            <span>Favorited</span>
                          </>
                        ) : (
                          <>
                            <FaRegHeart />
                            <span>Favorite</span>
                          </>
                        )}
                      </motion.button>

                      {/* Save Button */}
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const newSaved = saved.includes(selectedBook.id)
                            ? saved.filter(savedId => savedId !== selectedBook.id)
                            : [...saved, selectedBook.id];
                          setSaved(newSaved);
                          setLocalStorage('saved', newSaved);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
                          saved.includes(selectedBook.id)
                            ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                        }`}
                      >
                        <FaBookmark
                          className={
                            saved.includes(selectedBook.id)
                              ? 'text-indigo-600'
                              : ''
                          }
                        />
                        <span>{saved.includes(selectedBook.id) ? 'Saved' : 'Save'}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <motion.h2 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-2xl md:text-3xl font-bold text-gray-900"
                        >
                          {selectedBook.title}
                        </motion.h2>
                        {selectedBook.subtitle && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-lg text-gray-600 mt-1"
                          >
                            {selectedBook.subtitle}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Authors */}
                    {selectedBook.authors?.length > 0 && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-lg text-gray-700"
                      >
                        <span className="font-medium">By:</span> {selectedBook.authors.join(", ")}
                      </motion.p>
                    )}

                    {/* Rating */}
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mt-2 flex items-center"
                    >
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <motion.div 
                            key={i}
                            whileHover={{ scale: 1.2 }}
                          >
                            <FaStar 
                              className={`${i < Math.floor(selectedBook.averageRating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {selectedBook.averageRating || 'No'} rating ({selectedBook.ratingsCount || '0'} reviews)
                      </span>
                    </motion.div>

                    {/* Meta Info */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 grid grid-cols-2 gap-4"
                    >
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
                    </motion.div>

                    {/* Description */}
                    {selectedBook.description && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="mt-6"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 whitespace-pre-line">
                          {selectedBook.description.length > 500
                            ? `${selectedBook.description.substring(0, 500)}...`
                            : selectedBook.description}
                        </p>
                        {selectedBook.description.length > 500 && (
                          <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                            Read more
                          </button>
                        )}
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8 flex flex-wrap gap-4"
                    >
                      {selectedBook.infoLink && (
                        <motion.a
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={selectedBook.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                        >
                          <span>View on Google Books</span>
                          <FaExternalLinkAlt className="ml-2" />
                        </motion.a>
                      )}
                      {selectedBook.previewLink && (
                        <motion.a
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={selectedBook.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                        >
                          <FaBookOpen className="mr-2" />
                          <span>Read Preview</span>
                          <FaExternalLinkAlt className="ml-2" />
                        </motion.a>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}