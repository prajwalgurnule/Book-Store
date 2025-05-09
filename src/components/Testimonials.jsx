// Testimonials.jsx
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Patel",
      role: "Literature Professor",
      content: "This bookstore transformed my reading experience! The personalized recommendations introduced me to brilliant Indian authors like Arundhati Roy and Ruskin Bond that I had overlooked before.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Arjun Sharma",
      role: "Startup Founder & Bookworm",
      content: "As someone who juggles business and reading, their curated collections save me hours. Found the perfect blend of business wisdom and leisure reads. My productivity and relaxation both improved!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4
    },
    {
      id: 3,
      name: "Aanya Gupta",
      role: "Teen Reader",
      content: "The YA section is magical! They helped me move beyond international bestsellers to discover incredible Indian young adult fiction. Now all my friends ask for my book recommendations!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex mt-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">
            Voices from Our <span className="text-indigo-600">Bookish Community</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why over 50,000 Indian readers trust us for their literary journeys
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-indigo-500"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-indigo-100"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-indigo-600 font-medium">{testimonial.role}</p>
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
              <div className="mt-4 text-right">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
            Share Your Reading Story
          </button>
        </motion.div>
      </div>
    </section>
  );
}