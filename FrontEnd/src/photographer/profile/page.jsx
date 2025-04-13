"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Edit2,
  Facebook,
  Instagram,
  Linkedin,
  Save,
  Twitter,
  X,
  Plus,
  Star,
  StarHalf,
  Trash2,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "../../redux/api/authApi";
import {
  useGetPhotographerDetailsQuery,
  useUpdatePhotographerProfileMutation,
  useUploadPortfolioImageMutation,
  useDeletePortfolioImageMutation,
  useGetPhotographerAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useGetPhotographerReviewsQuery,
} from "../../redux/api/photographerApi";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../../redux/api/reviewApi";
import {
  selectCurrentUser,
  selectPhotographer,
} from "../../redux/slices/authSlice";
import DashboardLayout from "../DashboardLayout";

export default function PhotographerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const dispatch = useDispatch();

  // Get authenticated user and photographer data from Redux store
  const user = useSelector(selectCurrentUser);
  const photographerFromStore = useSelector(selectPhotographer);
  const reviewState = useSelector((state) => state.reviews);

  // Get unread message count from Redux store
  const { unreadCount } = useSelector((state) => state.messages);
  // Get the authenticated user (which includes photographerProfile, if available)
  const currentUser = useSelector((state) => state.auth.user);

  // Fetch current user data
  const {
    data: userData,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useGetCurrentUserQuery();

  // Photographer ID from the user's photographer profile or from the store
  const photographerId =
    user?.photographerProfile?.id || photographerFromStore?.id;

  // Fetch photographer details
  const {
    data: photographerData,
    isLoading: photographerLoading,
    refetch: refetchPhotographer,
  } = useGetPhotographerDetailsQuery(photographerId, {
    skip: !photographerId,
  });

  // Fetch availability for next 30 days (using today's date)
  const todayDate = new Date().toISOString().split("T")[0];
  const {
    data: availabilityData,
    isLoading: availabilityLoading,
    refetch: refetchAvailability,
  } = useGetPhotographerAvailabilityQuery(
    { id: photographerId, date: todayDate },
    { skip: !photographerId }
  );

  // Fetch photographer reviews
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useGetPhotographerReviewsQuery(photographerId, { skip: !photographerId });

  // Review mutations
  const [createReview, { isLoading: creatingReview }] =
    useCreateReviewMutation();
  const [updateReview, { isLoading: updatingReview }] =
    useUpdateReviewMutation();
  const [deleteReview, { isLoading: deletingReview }] =
    useDeleteReviewMutation();

  // Mutations for updating data
  const [updateProfile, { isLoading: updatingProfile }] =
    useUpdateProfileMutation();
  const [
    updatePhotographerProfile,
    { isLoading: updatingPhotographerProfile },
  ] = useUpdatePhotographerProfileMutation();
  const [updatePassword, { isLoading: updatingPassword }] =
    useUpdatePasswordMutation();
  const [uploadPortfolioImage, { isLoading: uploadingPortfolio }] =
    useUploadPortfolioImageMutation();
  const [deletePortfolioImage, { isLoading: deletingPortfolio }] =
    useDeletePortfolioImageMutation();
  const [updateAvailability, { isLoading: updatingAvailability }] =
    useUpdateAvailabilityMutation();

  // Combined loading state
  const isLoading = userLoading || photographerLoading;

  // State for form data including availability
  const [profile, setProfile] = useState({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
    },
    professional: {
      specialties: [],
      experience: "",
      equipment: "",
      languages: ["English"],
      education: "",
      awards: [],
    },
    social: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      profileVisibility: "public",
      bookingRequiresApproval: true,
      autoDeclineIfUnavailable: true,
    },
    availability: {
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
    },
  });

  useEffect(() => {
    if (userData?.user && photographerData) {
      const userObj = userData.user;
      const photographer = photographerData; // Use photographerData directly
      const nameParts = userObj.name ? userObj.name.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setProfile((prev) => ({
        ...prev,
        personal: {
          firstName,
          lastName,
          email: userObj.email || "",
          phone: userObj.phone || "",
          location: photographer.location || "",
          bio: photographer.bio || "",
        },
        professional: {
          specialties: photographer.specialties || [],
          experience: photographer.experience || "",
          equipment: photographer.equipment || "",
          languages: photographer.languages || ["English"],
          education: photographer.education || "",
          awards: photographer.awards || [],
        },
        social: {
          instagram: photographer.socialMedia?.instagram || "",
          facebook: photographer.socialMedia?.facebook || "",
          twitter: photographer.socialMedia?.twitter || "",
          linkedin: photographer.socialMedia?.linkedin || "",
          website: photographer.socialMedia?.website || "",
        },
        settings: {
          emailNotifications:
            photographer.settings?.emailNotifications !== false,
          smsNotifications: photographer.settings?.smsNotifications || false,
          profileVisibility:
            photographer.settings?.profileVisibility || "public",
          bookingRequiresApproval:
            photographer.settings?.bookingRequiresApproval !== false,
          autoDeclineIfUnavailable:
            photographer.settings?.autoDeclineIfUnavailable || false,
        },
        availability: photographer.availableDays || {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        },
      }));
    }
  }, [userData, photographerData]);

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveChanges();
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      const userPayload = {
        name: `${profile.personal.firstName} ${profile.personal.lastName}`.trim(),
        email: profile.personal.email,
        phone: profile.personal.phone,
      };

      const photographerPayload = {
        bio: profile.personal.bio,
        location: profile.personal.location,
        experience: profile.professional.experience,
        equipment: profile.professional.equipment,
        specialties: profile.professional.specialties,
        languages: profile.professional.languages,
        education: profile.professional.education,
        awards: profile.professional.awards,
        socialMedia: {
          instagram: profile.social.instagram,
          facebook: profile.social.facebook,
          twitter: profile.social.twitter,
          linkedin: profile.social.linkedin,
          website: profile.social.website,
        },
        settings: profile.settings,
      };

      await updateProfile(userPayload).unwrap();
      await updatePhotographerProfile(photographerPayload).unwrap();
      refetchUser();
      refetchPhotographer();
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleInputChange = (section, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    const specialties = [...profile.professional.specialties];
    if (specialties.includes(specialty)) {
      const filtered = specialties.filter((s) => s !== specialty);
      handleInputChange("professional", "specialties", filtered);
    } else {
      specialties.push(specialty);
      handleInputChange("professional", "specialties", specialties);
    }
  };

  const handleSettingToggle = (setting) => {
    handleInputChange("settings", setting, !profile.settings[setting]);
  };

  const handleAvailabilityToggle = (day) => {
    setProfile((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day],
      },
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.data?.message || "Failed to update password");
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      setUploadingImage(true);
      await updateProfile(formData).unwrap();
      refetchUser();
      alert("Profile image updated successfully");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePortfolioImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("portfolioImages", files[i]);
    }
    try {
      await uploadPortfolioImage(formData).unwrap();
      refetchPhotographer();
      alert("Portfolio images uploaded successfully");
    } catch (error) {
      console.error("Error uploading portfolio images:", error);
      alert("Failed to upload portfolio images");
    }
  };

  const handleDeletePortfolioImage = async (imageId) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deletePortfolioImage(imageId).unwrap();
      refetchPhotographer();
      alert("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting portfolio image:", error);
      alert("Failed to delete image");
    }
  };

  const handleSaveAvailability = async () => {
    try {
      await updateAvailability({ workingDays: profile.availability }).unwrap();
      refetchPhotographer();
      refetchAvailability();
      alert("Availability updated successfully");
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability");
    }
  };

  // Review handling functions
  const handleOpenReviewForm = () => {
    setShowReviewForm(true);
    setReviewFormData({
      rating: 0,
      comment: "",
    });
    setEditingReviewId(null);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setReviewFormData({
      rating: 0,
      comment: "",
    });
    setEditingReviewId(null);
  };

  const handleReviewInputChange = (field, value) => {
    setReviewFormData({
      ...reviewFormData,
      [field]: value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (reviewFormData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      if (editingReviewId) {
        // Update existing review
        await updateReview({
          reviewId: editingReviewId,
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
          photographerId: photographerId,
        }).unwrap();
        alert("Review updated successfully");
      } else {
        // Create new review
        await createReview({
          photographerId: photographerId,
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
        }).unwrap();
        alert("Review submitted successfully");
      }

      refetchReviews();
      handleCloseReviewForm();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewFormData({
      rating: review.rating,
      comment: review.comment,
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId).unwrap();
      refetchReviews();
      alert("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  // Helper function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="w-5 h-5 fill-yellow-400 text-yellow-400"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 h-48 md:h-64">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative h-full flex items-end">
            <div className="absolute -bottom-16 flex items-end">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden">
                  <img
                    src={
                      currentUser?.profileImage
                        ? `http://localhost:3000${currentUser.profileImage}`
                        : "/placeholder.svg?height=100&width=100"
                    }
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="h-6 w-6" />
                      )}
                    </label>
                  )}
                </div>
              </div>
              <div className="ml-4 mb-4 text-black">
                <h1 className="text-2xl font-bold">
                  {userData?.user?.name || "Photographer"}
                </h1>
              </div>
            </div>
            <div className="ml-auto mb-4">
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-colors"
                disabled={updatingProfile || updatingPhotographerProfile}
              >
                {isEditing ? (
                  <>
                    {updatingProfile || updatingPhotographerProfile ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {updatingProfile || updatingPhotographerProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "personal"
                      ? "border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "professional"
                      ? "border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Professional Details
                </button>
                <button
                  onClick={() => setActiveTab("availability")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "availability"
                      ? "border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Availability
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "reviews"
                      ? "border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === "settings"
                      ? "border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Account Settings
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.personal.firstName}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "firstName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="text-gray-900 dark:text-gray-100">
                          {profile.personal.firstName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.personal.lastName}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "lastName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="text-gray-900 dark:text-gray-100">
                          {profile.personal.lastName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profile.personal.email}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "email",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="text-gray-900 dark:text-gray-100">
                          {profile.personal.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profile.personal.phone}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "phone",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="text-gray-900 dark:text-gray-100">
                          {profile.personal.phone}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.personal.location}
                          onChange={(e) =>
                            handleInputChange(
                              "personal",
                              "location",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="text-gray-900 dark:text-gray-100">
                          {profile.personal.location}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          rows={4}
                          value={profile.personal.bio}
                          onChange={(e) =>
                            handleInputChange("personal", "bio", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line">
                          {profile.personal.bio}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Professional Details
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Photography Specialties
                      </label>
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Portrait",
                            "Wedding",
                            "Event",
                            "Family",
                            "Landscape",
                            "Product",
                            "Fashion",
                            "Sports",
                            "Architecture",
                          ].map((specialty) => (
                            <button
                              key={specialty}
                              type="button"
                              onClick={() => handleSpecialtyToggle(specialty)}
                              className={`px-3 py-1 text-sm rounded-full ${
                                profile.professional.specialties.includes(
                                  specialty
                                )
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {specialty}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profile.professional.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Years of Experience
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.professional.experience}
                            onChange={(e) =>
                              handleInputChange(
                                "professional",
                                "experience",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <div className="text-gray-900 dark:text-gray-100">
                            {profile.professional.experience}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Languages
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.professional.languages.join(", ")}
                            onChange={(e) =>
                              handleInputChange(
                                "professional",
                                "languages",
                                e.target.value.split(", ")
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <div className="text-gray-900 dark:text-gray-100">
                            {profile.professional.languages.join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Equipment
                        </label>
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={profile.professional.equipment}
                            onChange={(e) =>
                              handleInputChange(
                                "professional",
                                "equipment",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <div className="text-gray-900 dark:text-gray-100">
                            {profile.professional.equipment}
                          </div>
                        )}
                      </div>
                      {/* <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Education
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.professional.education}
                            onChange={(e) =>
                              handleInputChange(
                                "professional",
                                "education",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <div className="text-gray-900 dark:text-gray-100">
                            {profile.professional.education}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Awards & Recognition
                        </label>
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={profile.professional.awards.join("\n")}
                            onChange={(e) =>
                              handleInputChange(
                                "professional",
                                "awards",
                                e.target.value.split("\n")
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter each award on a new line"
                          />
                        ) : (
                          <ul className="list-disc pl-5 text-gray-900 dark:text-gray-100 space-y-1">
                            {profile.professional.awards.map((award, index) => (
                              <li key={index}>{award}</li>
                            ))}
                          </ul>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "availability" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Availability
                  </h2>
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                      Set your weekly availability:
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {[
                        "sunday",
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                      ].map((day) => (
                        <div key={day} className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <input
                                type="checkbox"
                                id={day}
                                checked={profile.availability[day]}
                                onChange={() => handleAvailabilityToggle(day)}
                                className="h-4 w-4"
                              />
                              <label
                                htmlFor={day}
                                className="capitalize text-sm text-gray-700 dark:text-gray-300"
                              >
                                {day}
                              </label>
                            </>
                          ) : (
                            <div className="capitalize text-sm text-gray-900 dark:text-gray-100">
                              {day}:{" "}
                              {profile.availability[day]
                                ? "Available"
                                : "Not Available"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <button
                        onClick={handleSaveAvailability}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        disabled={updatingAvailability}
                      >
                        {updatingAvailability
                          ? "Saving..."
                          : "Save Availability"}
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Next 30 Days Availability
                    </h3>
                    {availabilityLoading ? (
                      <div className="flex justify-center items-center">
                        <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                          <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 text-left">Date</th>
                              <th className="px-4 py-2">Availability</th>
                              <th className="px-4 py-2">Bookings</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {availabilityData &&
                              Object.keys(availabilityData.availability).map(
                                (date) => (
                                  <tr key={date}>
                                    <td className="px-4 py-2">{date}</td>
                                    <td className="px-4 py-2">
                                      {availabilityData.availability[date]
                                        .available
                                        ? "Available"
                                        : "Not Available"}
                                    </td>
                                    <td className="px-4 py-2">
                                      {
                                        availabilityData.availability[date]
                                          .bookings.length
                                      }
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Client Reviews
                    </h2>
                    {/* Only show add review button if user is not the photographer */}
                    {!user?.photographerProfile && (
                      <button
                        onClick={handleOpenReviewForm}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Review
                      </button>
                    )}
                  </div>

                  {/* Review summary */}
                  {!reviewsLoading &&
                    reviewsData?.reviews &&
                    reviewsData.reviews.length > 0 && (
                      <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="text-center md:text-left">
                            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                              {reviewsData.reviews.reduce(
                                (acc, review) => acc + review.rating,
                                0
                              ) / reviewsData.reviews.length || 0}
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                                / 5
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Based on {reviewsData.reviews.length} reviews
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = reviewsData.reviews.filter(
                                (r) => Math.round(r.rating) === rating
                              ).length;
                              const percentage =
                                (count / reviewsData.reviews.length) * 100;
                              return (
                                <div
                                  key={rating}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div className="w-8 text-right">{rating}</div>
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-yellow-400 h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="w-8">{count}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Review form */}
                  {showReviewForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        {editingReviewId
                          ? "Edit Your Review"
                          : "Write a Review"}
                      </h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Rating
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  handleReviewInputChange("rating", star)
                                }
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= reviewFormData.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="comment"
                            className="block text-sm font-medium mb-1"
                          >
                            Your Review
                          </label>
                          <textarea
                            id="comment"
                            rows={4}
                            value={reviewFormData.comment}
                            onChange={(e) =>
                              handleReviewInputChange("comment", e.target.value)
                            }
                            placeholder="Share your experience with this photographer..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleCloseReviewForm}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                            disabled={creatingReview || updatingReview}
                          >
                            {creatingReview || updatingReview ? (
                              <span className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {editingReviewId
                                  ? "Updating..."
                                  : "Submitting..."}
                              </span>
                            ) : editingReviewId ? (
                              "Update Review"
                            ) : (
                              "Submit Review"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Reviews list */}
                  {reviewsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : reviewsData &&
                    reviewsData.reviews &&
                    reviewsData.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviewsData.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  review.users?.profileImage
                                    ? `http://localhost:3000${review.users.profileImage}`
                                    : "/placeholder.svg?height=40&width=40"
                                }
                                alt={review.user?.name || "User"}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {review.users?.name || "Anonymous User"}
                                </p>
                                <div className="flex items-center gap-2">
                                  {renderStarRating(review.rating)}
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {review.createdAt &&
                                      formatDate(review.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Show edit/delete buttons if the review belongs to the current user */}
                            {review.userId === user?.id && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                                  aria-label="Edit review"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                  aria-label="Delete review"
                                  disabled={deletingReview}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="mt-3 text-gray-700 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No reviews yet. Be the first to leave a review!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Email Notifications
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Receive email notifications for bookings, messages,
                          and reviews
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            isEditing &&
                            handleSettingToggle("emailNotifications")
                          }
                          className={`${
                            isEditing
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          } relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            profile.settings.emailNotifications
                              ? "bg-purple-600"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <span
                            className={`${
                              profile.settings.emailNotifications
                                ? "translate-x-5"
                                : "translate-x-0"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>
                    </div>
                    {/* Similar toggle components for SMS Notifications, Profile Visibility, Booking Approval, and Auto-Decline */}
                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Account Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          Change Password
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                          Export My Data
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-800 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Deactivate Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Photographer Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {photographerData?.photographer?.averageRating?.toFixed(
                        1
                      ) || "0.0"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Rating
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {reviewsData?.reviews?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Reviews
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {photographerData?.photographer?.responseRate || "85%"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Response Rate
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {photographerData?.photographer?.responseTime || "2hr"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg. Response
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Social Profiles
                  </h2>
                  {isEditing && (
                    <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                      Edit Links
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Social media input fields */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-500">
                          <Instagram className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={profile.social.instagram}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "instagram",
                              e.target.value
                            )
                          }
                          placeholder="Instagram username"
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500">
                          <Facebook className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={profile.social.facebook}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "facebook",
                              e.target.value
                            )
                          }
                          placeholder="Facebook username"
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500">
                          <Twitter className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={profile.social.twitter}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "twitter",
                              e.target.value
                            )
                          }
                          placeholder="Twitter username"
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500">
                          <Linkedin className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={profile.social.linkedin}
                          onChange={(e) =>
                            handleInputChange(
                              "social",
                              "linkedin",
                              e.target.value
                            )
                          }
                          placeholder="LinkedIn username"
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {profile.social.instagram && (
                        <a
                          href={`https://instagram.com/${profile.social.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-500">
                            <Instagram className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Instagram</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {profile.social.instagram}
                            </div>
                          </div>
                        </a>
                      )}
                      {profile.social.facebook && (
                        <a
                          href={`https://facebook.com/${profile.social.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500">
                            <Facebook className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Facebook</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {profile.social.facebook}
                            </div>
                          </div>
                        </a>
                      )}
                      {profile.social.twitter && (
                        <a
                          href={`https://twitter.com/${profile.social.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500">
                            <Twitter className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Twitter</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {profile.social.twitter}
                            </div>
                          </div>
                        </a>
                      )}
                      {profile.social.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${profile.social.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-500">
                            <Linkedin className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">LinkedIn</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {profile.social.linkedin}
                            </div>
                          </div>
                        </a>
                      )}
                      {!profile.social.instagram &&
                        !profile.social.facebook &&
                        !profile.social.twitter &&
                        !profile.social.linkedin && (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No social profiles added yet
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Portfolio Highlights
                  </h2>
                  <Link
                    to="/photographer/portfolio"
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {photographerData?.photographer?.portfolioImages
                    ?.slice(0, 6)
                    .map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 relative group"
                      >
                        <img
                          src={
                            image.startsWith("http")
                              ? image
                              : `/uploads/${image}`
                          }
                          alt={`Portfolio item ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {isEditing && (
                          <button
                            onClick={() => handleDeletePortfolioImage(image)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  {isEditing && (
                    <label className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePortfolioImageUpload}
                        disabled={uploadingPortfolio}
                      />
                      {uploadingPortfolio ? (
                        <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus className="h-6 w-6 text-gray-400" />
                      )}
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* The main content area is now driven by the active tab */}
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    disabled={updatingPassword}
                  >
                    {updatingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
