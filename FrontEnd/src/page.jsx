import { Link } from "react-router-dom";
import { PhotographerCard } from "../UI/photographer-card";
import { MapPin, Search, Star, Camera, Calendar, Users } from "lucide-react";
import { Header } from "../UI/header";
import { Footer } from "../UI/footer";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background">
      <Header />
      <main className="flex-1 justify-center">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-purple-50 to-purple-100 py-12 md:py-32 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <motion.div
                className="flex flex-col justify-center space-y-6 max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full mb-2">
                      Professional Photography Services
                    </span>
                  </motion.div>
                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-purple-900 leading-tight"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3, duration: 0.7 },
                      },
                    }}
                  >
                    Find Your Perfect Photographer
                  </motion.h1>
                  <motion.p
                    className="text-lg text-gray-600 md:text-xl"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.4, duration: 0.7 },
                      },
                    }}
                  >
                    Discover talented photographers, explore their portfolios,
                    and book your perfect photoshoot with ease.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.5, duration: 0.7 },
                    },
                  }}
                >
                  <Link
                    to="/photographers"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-purple-600 px-8 text-base font-medium text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Browse Photographers
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-purple-200 bg-white px-8 text-base font-medium text-purple-700 shadow-sm transition-all hover:bg-gray-50 hover:text-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="w-full max-w-md lg:max-w-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <div className="rounded-2xl border bg-white shadow-xl p-6">
                  <div className="grid grid-cols-2 mb-4">
                    <button className="rounded-l-md border-b-2 border-purple-600 bg-white px-3 py-2 text-sm font-medium text-purple-700">
                      Search Photographers
                    </button>
                    <button className="rounded-r-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors">
                      Map View
                    </button>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-md p-1">
                      <MapPin className="h-5 w-5 text-purple-600 ml-2" />
                      <input
                        placeholder="Location or photographer name"
                        className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                        type="text"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          Booking date
                        </p>
                        <div className="rounded-md border p-3 bg-white hover:border-purple-300 transition-colors">
                          <div className="flex items-center gap-2 text-purple-700">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Select date</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          Photography type
                        </p>
                        <select className="w-full rounded-md border bg-white px-3 py-2 text-sm hover:border-purple-300 transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500">
                          <option value="">All types</option>
                          <option value="portrait">Portrait</option>
                          <option value="wedding">Wedding</option>
                          <option value="event">Event</option>
                          <option value="commercial">Commercial</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                    </div>
                    <button className="inline-flex h-12 w-full items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-base font-medium text-white transition-all hover:bg-purple-700 shadow-md hover:shadow-lg">
                      <Search className="mr-2 h-5 w-5" /> Find Photographers
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Photographers Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="text-center space-y-3 mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                Top Talent
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
                Featured Photographers
              </h2>
              <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
                Explore our top photographers and book your perfect photoshoot
              </p>
            </motion.div>

            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={scaleIn}>
                <PhotographerCard
                  name="Alex Morgan"
                  specialty="Portrait & Fashion"
                  description="Creative portrait and fashion photography with a modern twist."
                  price={120}
                  rating={4.9}
                  image="/placeholder.svg?height=400&width=600"
                  location="New York City"
                />
              </motion.div>
              <motion.div variants={scaleIn}>
                <PhotographerCard
                  name="Sarah Chen"
                  specialty="Wedding & Events"
                  description="Candid and artistic photography styles that capture genuine moments."
                  price={150}
                  rating={4.8}
                  image="/placeholder.svg?height=400&width=600"
                  location="Los Angeles"
                />
              </motion.div>
              <motion.div variants={scaleIn}>
                <PhotographerCard
                  name="Michael Rodriguez"
                  specialty="Landscape & Travel"
                  description="Capturing landscapes with vibrant colors and unique perspectives."
                  price={100}
                  rating={4.7}
                  image="/placeholder.svg?height=400&width=600"
                  location="Denver"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/photographers"
                className="inline-flex h-12 items-center justify-center rounded-md border border-purple-200 bg-white px-8 text-base font-medium text-purple-700 shadow-sm transition-all hover:bg-purple-50 hover:text-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                View All Photographers
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-gradient-to-b from-white to-purple-50 py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center justify-center space-y-3 text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
                Our Special Services
              </h2>
              <p className="max-w-2xl text-gray-600 md:text-lg">
                We provide comprehensive services to ensure your photography
                experience is perfect from start to finish
              </p>
            </motion.div>

            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div
                className="rounded-xl border bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                variants={scaleIn}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">
                    Verified Photographers
                  </h3>
                  <p className="text-center text-gray-600">
                    All photographers are vetted and approved by our team to
                    ensure quality service and professional results
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl border bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                variants={scaleIn}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">
                    Location Services
                  </h3>
                  <p className="text-center text-gray-600">
                    Find photographers near you or at your desired location for
                    your convenience and perfect setting
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl border bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                variants={scaleIn}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Camera className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">
                    Personalized Matching
                  </h3>
                  <p className="text-center text-gray-600">
                    Get matched with photographers based on your style
                    preferences and specific project requirements
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center justify-center space-y-3 text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
                Client Reviews
              </h2>
              <p className="max-w-2xl text-gray-600 md:text-lg">
                See what our clients say about their experiences with our
                photographers
              </p>
            </motion.div>

            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  name: "Emily Johnson",
                  session: "Portrait Session, June 2023",
                  text: "The photographer was amazing! They captured exactly what I wanted and were professional throughout the entire shoot. The photos turned out better than I could have imagined.",
                },
                {
                  name: "David Williams",
                  session: "Wedding Photography, May 2023",
                  text: "We couldn't be happier with our wedding photos! Our photographer was attentive, creative, and captured all the special moments of our day perfectly.",
                },
                {
                  name: "Sophia Garcia",
                  session: "Family Portraits, July 2023",
                  text: "Such a wonderful experience! The photographer was great with our kids and patient throughout the session. The photos are beautiful and will be treasured for years.",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl border bg-white overflow-hidden shadow-lg transition-all hover:shadow-xl"
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-8">
                    <div className="flex items-center space-x-1 mb-4">
                      {Array(5)
                        .fill(null)
                        .map((_, j) => (
                          <Star
                            key={j}
                            className={`h-5 w-5 ${
                              j < 4
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                    </div>
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 mb-6">
                      <p>"{testimonial.text}"</p>
                    </blockquote>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.session}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full bg-gradient-to-r from-purple-600 to-purple-700 py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-purple-100 bg-purple-700 bg-opacity-50 rounded-full">
                    Stay Updated
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                    Subscribe to Our Updates
                  </h2>
                  <p className="max-w-2xl text-purple-100 md:text-lg">
                    Get the latest photography tips, exclusive offers, and early
                    access to new photographers
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <form className="flex flex-col sm:flex-row gap-3">
                    <input
                      className="flex h-12 w-full rounded-md border-0 bg-white/10 px-4 py-2 text-white placeholder:text-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <motion.button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 py-2 text-base font-medium text-purple-700 transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Subscribe
                    </motion.button>
                  </form>
                  <p className="mt-3 text-xs text-purple-100 opacity-80">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
