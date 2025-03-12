import React from "react";
import Home from "./Home";
import Navbar from "../Common/Navbar";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Home = () => {
  const featuredPhotographers = [
    {
      id: 1,
      name: "Rajesh Sharma",
      rating: 4.8,
      reviews: 150,
      location: "Kathmandu",
      specialty: "Wedding",
      image: "",
    },
    {
      id: 2,
      name: "Prem Singh",
      rating: 4.9,
      reviews: 120,
      location: "Pokhara",
      specialty: "Portrait",
      image: "",
    },
    {
      id: 3,
      name: "Sunil Gurung",
      rating: 4.7,
      reviews: 98,
      location: "Lalitpur",
      specialty: "Events",
      image: "",
    },
  ];

  const features = [
    {
      title: "Verified Professionals",
      description:
        "All photographers are verified and experienced professionals",
      icon: "🏆",
    },
    {
      title: "Secure Payments",
      description: "Safe and secure payment methods for your peace of mind",
      icon: "🔒",
    },
    {
      title: "Easy Booking",
      description: "Simple and straightforward booking process",
      icon: "📅",
    },
    {
      title: "Client Reviews",
      description: "Transparent reviews from verified clients",
      icon: "⭐",
    },
  ];

  const testimonials = [
    {
      name: "Anita Patel",
      comment:
        "Found the perfect wedding photographer through this platform. Extremely satisfied with the service!",
      rating: 5,
      image: "",
    },
    {
      name: "Binod Sharma",
      comment:
        "Great experience booking our family photoshoot. Very professional photographers.",
      rating: 4,
      image: "",
    },
    {
      name: "Maya Tamang",
      comment:
        "Easy to use platform with excellent customer support. Highly recommended!",
      rating: 5,
      image: "",
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <Banner />

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {["Search", "Compare", "Book", "Pay"].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">{index + 1}</span>
              </div>
              <h3 className="text-white text-xl mb-2">{step}</h3>
              <p className="text-gray-400">
                Step {index + 1} description goes here
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Photographers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Featured Photographers
          </h2>
          <button className="text-purple-500 hover:text-purple-400">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPhotographers.map((photographer) => (
            <div key={photographer.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src={photographer.image}
                  alt={photographer.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-white text-xl font-semibold">
                    {photographer.name}
                  </h3>
                  <p className="text-gray-400">{photographer.specialty}</p>
                </div>
              </div>
              <div className="flex items-center text-yellow-400 mb-2">
                {"★".repeat(Math.floor(photographer.rating))}
                <span className="text-gray-400 ml-2">
                  ({photographer.reviews} reviews)
                </span>
              </div>
              <p className="text-gray-400">{photographer.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-white font-semibold">
                    {testimonial.name}
                  </h3>
                  <div className="flex text-yellow-400">
                    {"★".repeat(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-400">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Capture Your Special Moments?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who found their perfect
          photographer.
        </p>
        <button className="w-32 h-10 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-all duration-200">
          Book Now
        </button>
      </section>
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding Section */}
          <div>
            <h2 className="text-2xl font-bold">SnapNepal</h2>
            <p className="mt-2 text-gray-400">
              Connect with the best photographers for your special moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Photographers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="mt-3 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
          &copy; 2025 SnapNepal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
