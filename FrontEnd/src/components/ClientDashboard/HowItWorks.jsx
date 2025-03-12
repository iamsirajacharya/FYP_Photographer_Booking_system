import React from "react";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const steps = [
  {
    step: 1,
    title: "Search",
    description: "Find photographers by specifying location and event type.",
  },
  {
    step: 2,
    title: "Compare",
    description: "Review profiles, ratings, portfolios, and prices.",
  },
  {
    step: 3,
    title: "Book",
    description: "Choose your preferred photographer and book an appointment.",
  },
  {
    step: 4,
    title: "Enjoy",
    description: "Experience your special day captured beautifully.",
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold mb-4 mx-auto">
                {step}
              </div>
              <h3 className="text-center text-xl font-semibold mb-2">
                {title}
              </h3>
              <p className="text-gray-400 text-center">{description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
