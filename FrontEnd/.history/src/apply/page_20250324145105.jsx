import React, { useState } from "react";
import { useApplyAsPhotographerMutation } from "../redux/api/photographerApi";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import { Upload, CheckCircle } from "lucide-react";

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [portfolioFiles, setPortfolioFiles] = useState([]);

  // Hook from RTK Query to call the POST /photographers/apply endpoint
  const [applyPhotographer, { isLoading }] = useApplyAsPhotographerMutation();

  // Local state for form fields
  const [formData, setFormData] = useState({
    // Step 1
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",

    // Step 2
    experience: "",
    equipment: "",
    specialty: [], // We'll store checked specialties here

    // Step 3
    hourlyRate: "",
    minHours: "",
    website: "",
    instagram: "",
    additionalInfo: "",
    // For now, let's not actually upload images.
    // We'll just store placeholders or handle that separately.
  });

  // Handle next/previous steps
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  // Generic field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If it's a checkbox for specialties:
    if (name === "specialty" && type === "checkbox") {
      if (checked) {
        // Add specialty to array
        setFormData((prev) => ({
          ...prev,
          specialty: [...prev.specialty, value],
        }));
      } else {
        // Remove specialty from array
        setFormData((prev) => ({
          ...prev,
          specialty: prev.specialty.filter((s) => s !== value),
        }));
      }
    } else {
      // Normal text/number field
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB!");
      return;
    }

    setPortfolioFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = file;
      return newFiles;
    });
  };

  // Final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationData = new FormData();

    applicationData.append("firstName", formData.firstName);
    applicationData.append("lastName", formData.lastName);
    applicationData.append("email", formData.email);
    applicationData.append("phone", formData.phone);
    applicationData.append("location", formData.location);
    applicationData.append("bio", formData.bio);
    applicationData.append("experience", formData.experience);
    // You are NOT sending `specialty`, only `specialties`
    applicationData.append("specialty", formData.specialty[0] || "General");
    // applicationData.append("specialties", JSON.stringify(formData.specialty));

    applicationData.append("equipment", formData.equipment);
    applicationData.append("hourlyRate", formData.hourlyRate);
    applicationData.append("minHours", formData.minHours);
    applicationData.append("website", formData.website);
    applicationData.append("instagram", formData.instagram);
    applicationData.append("additionalInfo", formData.additionalInfo);

    // Append specialties (as JSON or CSV depending on backend)
    applicationData.append("specialty", JSON.stringify(formData.specialty));

    // Append files
    portfolioFiles.forEach((file, idx) => {
      if (file) {
        applicationData.append(`portfolioImages`, file); // or `portfolioImages[]` if your backend expects arrays
      }
    });

    try {
      await applyPhotographer(applicationData).unwrap();
      setFormSubmitted(true);
    } catch (error) {
      console.error("Apply error:", error);
      alert(error?.data?.message || "Failed to submit application");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-purple-800">
              Become a Photographer
            </h1>
            <p className="mt-2 text-gray-600">
              Join our platform and connect with clients looking for your
              photography skills
            </p>
          </div>

          {formSubmitted ? (
            /* Success Card Equivalent */
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="pt-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Application Submitted!</h2>
                  <p className="text-gray-600">
                    Thank you for applying to join our platform as a
                    photographer. Our team will review your application and get
                    back to you within 2-3 business days.
                  </p>
                  <button
                    className="mt-4 rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
                    onClick={() => (window.location.href = "/")}
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Form Card Equivalent */
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {/* Header area (title + description) */}
              <div className="mb-4">
                <h2 className="text-xl font-bold">Photographer Application</h2>
                <p className="text-gray-600">
                  Complete the form below to apply as a photographer on our
                  platform
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {/* Step 1 */}
                  <div className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStep >= 1
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      1
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      Personal Info
                    </span>
                  </div>
                  <div className="h-0.5 w-10 bg-gray-200" />

                  {/* Step 2 */}
                  <div className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStep >= 2
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      Experience &amp; Equipment
                    </span>
                  </div>
                  <div className="h-0.5 w-10 bg-gray-200" />

                  {/* Step 3 */}
                  <div className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStep >= 3
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      3
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      Portfolio &amp; Pricing
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="first-name"
                          className="text-sm font-medium"
                        >
                          First Name
                        </label>
                        <input
                          id="first-name"
                          name="firstName"
                          placeholder="Enter your first name"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="last-name"
                          className="text-sm font-medium"
                        >
                          Last Name
                        </label>
                        <input
                          id="last-name"
                          name="lastName"
                          placeholder="Enter your last name"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        placeholder="City, State"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself and your photography journey"
                        rows="4"
                        required
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="experience"
                        className="text-sm font-medium"
                      >
                        Years of Experience
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="">Select experience</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="specialty"
                        className="text-sm font-medium"
                      >
                        Photography Specialties
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Portrait",
                          "Wedding",
                          "Event",
                          "Family",
                          "Commercial",
                          "Landscape",
                          "Fine Art",
                          "Fashion",
                          "Sports",
                          "Product",
                        ].map((specialty) => (
                          <div
                            key={specialty}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              name="specialty"
                              value={specialty}
                              id={`specialty-${specialty}`}
                              checked={formData.specialty.includes(specialty)}
                              onChange={handleChange}
                              className="rounded border-gray-300"
                            />
                            <label
                              htmlFor={`specialty-${specialty}`}
                              className="text-sm"
                            >
                              {specialty}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="equipment"
                        className="text-sm font-medium"
                      >
                        Equipment
                      </label>
                      <textarea
                        id="equipment"
                        name="equipment"
                        placeholder="List your camera bodies, lenses, lighting equipment, etc."
                        rows="4"
                        required
                        value={formData.equipment}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="rounded border border-purple-600 px-4 py-2 text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        Previous Step
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Portfolio Images</p>
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <label
                              htmlFor={`file-upload-${index}`}
                              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 hover:bg-gray-50"
                            >
                              {portfolioFiles[index] ? (
                                <img
                                  src={URL.createObjectURL(
                                    portfolioFiles[index]
                                  )}
                                  alt={`Portfolio ${index + 1}`}
                                  className="h-full w-full object-cover rounded"
                                />
                              ) : (
                                <>
                                  <Upload className="mb-2 h-6 w-6 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    Upload Image
                                  </span>
                                </>
                              )}
                            </label>
                            <input
                              type="file"
                              id={`file-upload-${index}`}
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, index)}
                              className="hidden"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Upload up to 6 images. Max size 5MB each.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-medium">
                        Portfolio Website (optional)
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://your-portfolio.com"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="instagram"
                        className="text-sm font-medium"
                      >
                        Instagram Handle (optional)
                      </label>
                      <input
                        id="instagram"
                        name="instagram"
                        placeholder="@yourusername"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="hourly-rate"
                          className="text-sm font-medium"
                        >
                          Hourly Rate ($)
                        </label>
                        <input
                          id="hourly-rate"
                          name="hourlyRate"
                          type="number"
                          min="0"
                          placeholder="Enter your hourly rate"
                          required
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="min-hours"
                          className="text-sm font-medium"
                        >
                          Minimum Booking Hours
                        </label>
                        <input
                          id="min-hours"
                          name="minHours"
                          type="number"
                          min="1"
                          placeholder="Minimum hours per booking"
                          required
                          value={formData.minHours}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="additional-info"
                        className="text-sm font-medium"
                      >
                        Additional Information
                      </label>
                      <textarea
                        id="additional-info"
                        name="additionalInfo"
                        placeholder="Any other information you'd like to share with us"
                        rows="3"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="rounded border border-purple-600 px-4 py-2 text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        Previous Step
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        {isLoading ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
