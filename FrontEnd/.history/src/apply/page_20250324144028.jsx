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
    specialty: [], // array for checkbox specialties

    // Step 3
    hourlyRate: "",
    minHours: "",
    website: "",
    instagram: "",
    additionalInfo: "",
  });

  // Handle next/previous steps
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  // Generic field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "specialty" && type === "checkbox") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          specialty: [...prev.specialty, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          specialty: prev.specialty.filter((s) => s !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file upload
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

    // Step 1 Data
    applicationData.append("firstName", formData.firstName);
    applicationData.append("lastName", formData.lastName);
    applicationData.append("email", formData.email);
    applicationData.append("phone", formData.phone);
    applicationData.append("location", formData.location);
    applicationData.append("bio", formData.bio);

    // Step 2 Data
    applicationData.append("experience", formData.experience);
    applicationData.append("equipment", formData.equipment);

    // ✅ FIX: Send a SINGLE specialty (for Photographer.specialty in the DB)
    applicationData.append("specialty", formData.specialty[0] || "General");

    // ✅ Also send an ARRAY of specialties (for the PhotographerSpecialty relation)
    applicationData.append("specialties", JSON.stringify(formData.specialty));

    // Step 3 Data
    applicationData.append("hourlyRate", formData.hourlyRate);
    applicationData.append("minHours", formData.minHours);
    applicationData.append("website", formData.website);
    applicationData.append("instagram", formData.instagram);
    applicationData.append("additionalInfo", formData.additionalInfo);

    // Append portfolio images
    portfolioFiles.forEach((file) => {
      if (file) {
        applicationData.append("portfolioImages", file);
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
              photography skills.
            </p>
          </div>

          {formSubmitted ? (
            // ✅ Success Message
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="pt-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Application Submitted!</h2>
                  <p className="text-gray-600">
                    Thank you for applying! Our team will review your
                    application and get back to you within 2-3 business days.
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
            // ✅ Multi-Step Form
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {/* Progress Stepper */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          currentStep >= step
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {step}
                      </div>
                      {step !== 3 && (
                        <div className="h-0.5 w-10 bg-gray-200 mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Steps */}
              <form onSubmit={handleSubmit}>
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full rounded-md border px-3 py-2"
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
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                    >
                      Next Step
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="experience"
                        className="text-sm font-medium"
                      >
                        Experience
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Specialties</label>
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
                        ].map((spec) => (
                          <div key={spec} className="flex items-center">
                            <input
                              type="checkbox"
                              name="specialty"
                              value={spec}
                              checked={formData.specialty.includes(spec)}
                              onChange={handleChange}
                            />
                            <label className="ml-2 text-sm">{spec}</label>
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
                        rows={3}
                        value={formData.equipment}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="rounded border border-purple-600 px-4 py-2 text-purple-600"
                      >
                        Previous Step
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="rounded bg-purple-600 px-4 py-2 text-white"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    {/* Portfolio Upload */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Portfolio Images</p>
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <label
                              htmlFor={`file-${index}`}
                              className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
                            >
                              {portfolioFiles[index] ? (
                                <img
                                  src={URL.createObjectURL(
                                    portfolioFiles[index]
                                  )}
                                  alt="Preview"
                                  className="h-full w-full object-cover rounded"
                                />
                              ) : (
                                <Upload className="text-gray-400 h-6 w-6" />
                              )}
                            </label>
                            <input
                              id={`file-${index}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, index)}
                              className="hidden"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="hourlyRate"
                          className="text-sm font-medium"
                        >
                          Hourly Rate ($)
                        </label>
                        <input
                          id="hourlyRate"
                          name="hourlyRate"
                          type="number"
                          min="0"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          required
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="minHours"
                          className="text-sm font-medium"
                        >
                          Minimum Hours
                        </label>
                        <input
                          id="minHours"
                          name="minHours"
                          type="number"
                          min="1"
                          value={formData.minHours}
                          onChange={handleChange}
                          required
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-medium">
                        Portfolio Website
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="instagram"
                        className="text-sm font-medium"
                      >
                        Instagram Handle
                      </label>
                      <input
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="additionalInfo"
                        className="text-sm font-medium"
                      >
                        Additional Info
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        rows={3}
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="rounded border border-purple-600 px-4 py-2 text-purple-600"
                      >
                        Previous Step
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded bg-purple-600 px-4 py-2 text-white"
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
