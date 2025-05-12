import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { FaSearch, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import Card from "./Card";
import NoResults from "./NoResults";
import Loading from "./Loading";
import Testimonials from "./Testimonials";

import Logo from "../images/Book.png";
import Spline from "@splinetool/react-spline";
import noCover from "../images/NoImage.svg";

export default function Main() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [bookData, setBookData] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]); // New state for random books
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [saved, setSaved] = useState([]);
  const [cart, setCart] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const storedFavorites = localStorage.getItem("BookStoreFavorites");
        const storedSaved = localStorage.getItem("BookStoreSaved");
        const storedCart = localStorage.getItem("BookStoreCart");
        
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        if (storedSaved) setSaved(JSON.parse(storedSaved));
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        setFavorites([]);
        setSaved([]);
        setCart([]);
      }
    };

    loadFromLocalStorage();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("BookStoreFavorites", JSON.stringify(favorites));
      localStorage.setItem("BookStoreSaved", JSON.stringify(saved));
      localStorage.setItem("BookStoreCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [favorites, saved, cart]);

  // Fetch random books on component mount and when hasSearched changes
  useEffect(() => {
    if (!hasSearched) {
      fetchRandomBooks();
    }
  }, [hasSearched]);

  // Scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchRandomBooks = () => {
    setLoading(true);
    const subjects = [
      'fiction', 'fantasy', 'science', 'history', 
      'romance', 'mystery', 'biography', 'technology'
    ];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${randomSubject}&maxResults=12&key=AIzaSyDaLzmtMXyLkRnXJzGuxjkRfYJGYpmrqFM`
      )
      .then((res) => {
        setRandomBooks(res.data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const toggleFavorite = (bookId) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const toggleSaved = (bookId) => {
    setSaved((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const addToCart = (book) => {
    if (!book || !book.id) return;
    
    setCart((prev) => {
      const currentCart = Array.isArray(prev) ? prev : [];
      const existingItem = currentCart.find(item => item.id === book.id);
      
      if (existingItem) {
        return currentCart.map(item =>
          item.id === book.id 
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      }
      return [...currentCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => (Array.isArray(prev) ? prev.filter(item => item.id !== bookId) : []));
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart((prev) => {
      if (!Array.isArray(prev)) return [];
      
      return prev.map(item =>
        item.id === bookId 
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );
    });
  };

  // Calculate totals with proper error handling
  const cartTotalItems = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item?.quantity || 0), 0)
    : 0;

  const cartTotalPrice = Array.isArray(cart)
    ? (cart.reduce((total, item) => {
        const price = parseFloat(item?.price) || 0;
        const quantity = item?.quantity || 0;
        return total + (price * quantity);
      }, 0)).toFixed(2)
    : "0.00";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const searchBook = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (search.trim()) {
      setSearchTerm(search);
      setHasSearched(true);
      setLoading(true);
      setActiveCategory(null);
      
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=40&key=AIzaSyDaLzmtMXyLkRnXJzGuxjkRfYJGYpmrqFM`
        )
        .then((res) => {
          setBookData(res.data.items || []);
          setLoading(false);
          setSearch("");
          setTimeout(() => {
            document.getElementById("search-results").scrollIntoView({
              behavior: "smooth",
            });
          }, 100);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const handleCategorySearch = (category) => {
    setSearchTerm(category);
    setHasSearched(true);
    setLoading(true);
    setActiveCategory(category);
    
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${category}&maxResults=40&key=AIzaSyDaLzmtMXyLkRnXJzGuxjkRfYJGYpmrqFM`
      )
      .then((res) => {
        setBookData(res.data.items || []);
        setLoading(false);
        setTimeout(() => {
          document.getElementById("search-results").scrollIntoView({
            behavior: "smooth",
          });
        }, 100);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const categoryColors = [
    "from-pink-100 to-pink-200",
    "from-yellow-100 to-yellow-200",
    "from-green-100 to-green-200",
    "from-blue-100 to-blue-200",
    "from-purple-100 to-purple-200",
    "from-red-100 to-red-200",
    "from-indigo-100 to-indigo-200",
    "from-emerald-100 to-emerald-200",
    "from-orange-100 to-orange-200",
    "from-cyan-100 to-cyan-200",
    "from-lime-100 to-lime-200",
    "from-rose-100 to-rose-200",
  ];

  // Combine all books for wishlist display
  const allBooks = [...bookData, ...randomBooks];

  return (
    <div className="bg-white min-h-screen">
      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-4 lg:px-6 max-w-7xl mx-auto"
        >
          {/* Logo & Title */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center"
          >
            <a href="#" className="-m-1.5 p-1.5">
              <img alt="" src={Logo} className="h-8 w-auto" />
            </a>
            <p className="ml-2 font-bold text-lg hidden sm:block">
              <span className="text-indigo-600">Book</span>Store
            </p>
          </motion.div>

          {/* Search Field - Visible on desktop */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden md:block w-1/3 mx-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for books..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={searchBook}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </motion.div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowWishlistDropdown(!showWishlistDropdown);
                  setShowCartDropdown(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="Wishlist"
              >
                <FaHeart className={`h-5 w-5 ${favorites.length > 0 ? 'text-red-500' : 'text-gray-600'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              {/* Wishlist Dropdown */}
              <AnimatePresence>
                {showWishlistDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-semibold text-gray-800">Wishlist ({favorites.length})</h3>
                        <button 
                          onClick={() => setShowWishlistDropdown(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                      
                      {favorites.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto py-2">
                          {allBooks
                            .filter(book => book && favorites.includes(book.id))
                            .map(book => (
                              <div key={book.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                                <img
                                  src={book.volumeInfo?.imageLinks?.thumbnail || noCover}
                                  alt={book.volumeInfo?.title}
                                  className="w-10 h-14 object-cover rounded"
                                />
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{book.volumeInfo?.title || "Untitled"}</p>
                                  <p className="text-xs text-gray-500">by {book.volumeInfo?.authors?.[0] || 'Unknown'}</p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(book.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <IoMdClose />
                                </button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-gray-500">
                          Your wishlist is empty
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCartDropdown(!showCartDropdown);
                  setShowWishlistDropdown(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="Cart"
              >
                <FaShoppingCart className={`h-5 w-5 ${cart.length > 0 ? 'text-indigo-600' : 'text-gray-600'}`} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </button>
              
              {/* Cart Dropdown */}
              <AnimatePresence>
                {showCartDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-semibold text-gray-800">Your Cart ({cartTotalItems})</h3>
                        <button 
                          onClick={() => setShowCartDropdown(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                      
                      {cart.length > 0 ? (
                        <>
                          <div className="max-h-60 overflow-y-auto py-2">
                            {cart.map(item => (
                              <div key={item.id} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-10 h-14 object-cover rounded"
                                />
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center border rounded">
                                      <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                      >
                                        -
                                      </button>
                                      <span className="px-2 text-sm">{item.quantity}</span>
                                      <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 ml-2"
                                >
                                  <IoMdClose />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-3 mt-2">
                            <div className="flex justify-between font-semibold text-gray-800">
                              <span>Total:</span>
                              <span>${cartTotalPrice}</span>
                            </div>
                            <button className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                              Checkout
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-4 text-center text-gray-500">
                          Your cart is empty
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Search - Visible only on mobile */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for books..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={searchBook}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="md:hidden"
        >
          <div className="fixed inset-0 z-40" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <a href="#" className="-m-1.5 p-1.5">
                  <img alt="" src={Logo} className="h-8 w-auto" />
                </a>
                <p className="ml-2 font-bold">
                  <span className="text-indigo-600">Book</span>Store
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                    <FaHeart className="text-red-500 mr-3" />
                    <span>Wishlist ({favorites.length})</span>
                  </div>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                    <FaShoppingCart className="text-indigo-600 mr-3" />
                    <span>Cart ({cartTotalItems})</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Main Content - Adjusted for sticky header */}
      <main className="pt-5">
        {/* Hero Section */}
        <div className="relative isolate px-6 lg:px-8">
          {/* Animated Background Elements */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80ee] to-[#2d22ca] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          {/* Hero Content */}
          <div className="mx-auto max-w-7xl flex flex-col-reverse md:flex-row items-center py-12 sm:py-24 lg:py-32">
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left md:w-1/2"
            >
              <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Discover Your Next <span className="text-indigo-600">Favorite</span> Book
              </h1>

              <p className="mt-6 text-pretty text-lg font-medium text-gray-600 sm:text-xl/8">
                Explore a world of stories, knowledge, and inspiration. <br />
                Find books that ignite your curiosity and fuel your imagination.
              </p>

              {/* Search Field */}
              <div className="mt-8 flex items-center justify-center md:justify-start gap-x-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  className="relative w-2/3 md:w-full"
                >
                  <input
                    type="text"
                    placeholder="Search for books..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 pl-12"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={searchBook}
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
                >
                  <FaSearch className="text-white mr-2" />
                  Search
                </motion.button>
              </div>

              {/* Book Categories */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  "Fiction", "Non-Fiction", "Science", "History", 
                  "Biography", "Fantasy", "Mystery", "Romance",
                  "Thriller", "Self-Help", "Business", "Technology"
                ].map((category, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-lg p-2 bg-gradient-to-br ${categoryColors[index % categoryColors.length]} 
                      shadow-sm text-center cursor-pointer hover:shadow-md transition-all ${
                        activeCategory === category ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    onClick={() => handleCategorySearch(category)}
                  >
                    <h3 className="text-sm font-medium text-indigo-800">
                      {category}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 3D Book Animation */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 h-[400px] md:h-[500px] mt-8 md:mt-0 md:ml-8"
            >
              <Spline
                scene="https://prod.spline.design/RD6H3cg-Ld2vg8Ze/scene.splinecode"
                className="w-full h-full"
              />
            </motion.div>
          </div>

          {/* Background Elements */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>

        {/* Random Books Section */}
        {!hasSearched && (
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">
                  <span className="text-indigo-600">Featured</span> Books
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover our handpicked selection of books across various genres
                </p>
                <button
                  onClick={fetchRandomBooks}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center mx-auto"
                >
                  Refresh Selection
                </button>
              </motion.div>

              {loading ? (
                <Loading />
              ) : (
                <Card 
                  book={randomBooks} 
                  favorites={favorites} 
                  saved={saved}
                  toggleFavorite={toggleFavorite}
                  toggleSaved={toggleSaved}
                  addToCart={addToCart}
                />
              )}
            </div>       
          </div>
        )}

        {/* Loading Animation */}
        {loading && <Loading />}

        {/* Search Results */}
        <div id="search-results" className="mt-10">
          {!loading && hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-4"
            >
              <h2 className="text-4xl font-bold text-gray-800  text-center mb-4 font-serif">
                {searchTerm ? (
                  <>
                    <span className="text-indigo-600">Results</span> for "{searchTerm}"
                  </>
                ) : (
                  "Browse Books"
                )}
              </h2>

              <AnimatePresence>
                {bookData.length > 0 ? (
                  <Card 
                    book={bookData} 
                    favorites={favorites} 
                    saved={saved}
                    toggleFavorite={toggleFavorite}
                    toggleSaved={toggleSaved}
                    addToCart={addToCart}
                  />
                ) : (
                  <NoResults />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Testimonials Section */}
        {!hasSearched && <Testimonials />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <img src={Logo} alt="Book Store Logo" className="h-10 mr-2" />
                <span className="text-2xl font-bold">BookStore</span>
              </div>
              <p className="mt-3 text-gray-400 max-w-xs">
                Your gateway to a world of knowledge and imagination.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
              <div>
                <h3 className="text-lg font-semibold mb-4">Explore</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Featured</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Categories</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Account</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Wishlist</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Cart</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Orders</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} BookStore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}