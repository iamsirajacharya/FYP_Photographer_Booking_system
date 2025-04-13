import { useState } from "react";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import { Upload, CheckCircle } from "lucide-react";

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
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
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Application Submitted!</h2>
                  <p className="text-gray-600">
                    Thank you for applying to join our platform as a
                    photographer. Our team will review your application and get
                    back to you within 2-3 business days.
                  </p>
                  <Button
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={() => (window.location.href = "/")}
                  >
                    Return to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Photographer Application</CardTitle>
                <CardDescription>
                  Complete the form below to apply as a photographer on our
                  platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
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
                    <div className="h-0.5 w-10 bg-gray-200"></div>
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
                        Experience & Equipment
                      </span>
                    </div>
                    <div className="h-0.5 w-10 bg-gray-200"></div>
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
                        Portfolio & Pricing
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input
                            id="first-name"
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input
                            id="last-name"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself and your photography journey"
                          rows="4"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <select
                          id="experience"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select experience</option>
                          <option value="1-2">1-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-10">5-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialties">
                          Photography Specialties
                        </Label>
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
                                id={`specialty-${specialty}`}
                                className="rounded border-gray-300"
                              />
                              <Label
                                htmlFor={`specialty-${specialty}`}
                                className="text-sm"
                              >
                                {specialty}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="equipment">Equipment</Label>
                        <Textarea
                          id="equipment"
                          placeholder="List your camera bodies, lenses, lighting equipment, etc."
                          rows="4"
                          required
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Portfolio Images</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3, 4, 5, 6].map((index) => (
                            <div
                              key={index}
                              className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 hover:bg-gray-50"
                            >
                              <Upload className="mb-2 h-6 w-6 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Upload Image
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Upload 6 of your best work samples (max 5MB each)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">
                          Portfolio Website (optional)
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://your-portfolio.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">
                          Instagram Handle (optional)
                        </Label>
                        <Input id="instagram" placeholder="@yourusername" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                          <Input
                            id="hourly-rate"
                            type="number"
                            min="0"
                            placeholder="Enter your hourly rate"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="min-hours">
                            Minimum Booking Hours
                          </Label>
                          <Input
                            id="min-hours"
                            type="number"
                            min="1"
                            placeholder="Minimum hours per booking"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="additional-info">
                          Additional Information
                        </Label>
                        <Textarea
                          id="additional-info"
                          placeholder="Any other information you'd like to share with us"
                          rows="3"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Submit Application
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
