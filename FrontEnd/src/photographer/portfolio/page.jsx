import { useState } from "react";
import { Camera, Edit, Eye, Plus, Trash, Upload } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import {
  useGetPhotographerPortfolioQuery,
  useUploadPortfolioImageMutation,
  useDeletePortfolioImageMutation,
} from "../../redux/api/photographerApi";
import { useSelector } from "react-redux";

export default function PhotographerPortfolioPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);

  // Get the photographer ID from the authenticated user
  const user = useSelector((state) => state.auth.user);
  const photographerId = user?.photographerProfile?.id;

  // Define your backend URL correctly.
  const BACKEND_URL = "http://localhost:3000"; // Adjust if your backend runs on a different port (e.g., http://localhost:8000)

  // Fetch portfolio data
  const {
    data: portfolioData,
    isLoading: portfolioLoading,
    refetch,
  } = useGetPhotographerPortfolioQuery(photographerId, {
    skip: !photographerId,
  });

  // Mutations for portfolio management
  const [uploadPortfolioImage, { isLoading: isUploading }] =
    useUploadPortfolioImageMutation();
  const [deletePortfolioImage, { isLoading: isDeleting }] =
    useDeletePortfolioImageMutation();

  // Portfolio images from API
  const portfolioImages = portfolioData?.portfolioImages || [];

  // Mock categories data
  const categories = [
    { id: "all", name: "All Photos", count: portfolioImages.length },
    // { id: "portrait", name: "Portrait", count: 0 },
    // { id: "wedding", name: "Wedding", count: 0 },
    // { id: "fashion", name: "Fashion", count: 0 },
    // { id: "family", name: "Family", count: 0 },
    // { id: "event", name: "Event", count: 0 },
  ];

  // Build filtered images array with full image URL
  const filteredImages = portfolioImages.map((image, index) => ({
    id: index,
    src: `${BACKEND_URL}/uploads/${image}`, // Prepend BACKEND_URL to get full URL
    category: "all", // In a real app, category comes from the API
    title: `Image ${index + 1}`,
    featured: index < 3,
    date: new Date().toISOString().split("T")[0],
  }));

  // Toggle image selection
  const toggleImageSelection = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  // Handle bulk actions
  const handleDeleteSelected = async () => {
    try {
      for (const imageId of selectedImages) {
        const filename = portfolioImages[imageId];
        if (filename) {
          await deletePortfolioImage(filename).unwrap();
        }
      }
      setSelectedImages([]);
      refetch();
    } catch (error) {
      console.error("Error deleting images:", error);
      alert("Failed to delete images");
    }
  };

  const handleFeatureSelected = () => {
    alert(`Featuring ${selectedImages.length} images`);
    setSelectedImages([]);
  };

  // Handle file upload change—if multiple files are allowed you can loop
  // const handleFileChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length > 0) {
  //     // For now, store only the first file.
  //     setUploadFile(files[0]);
  //     // Uncomment below to support multiple files (and later loop in handleUpload)
  //     // setUploadFile(files);
  //   }
  // };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadFile(files); // now storing an array of files
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || uploadFile.length === 0) return;

    try {
      const formData = new FormData();
      uploadFile.forEach((file) => {
        formData.append("portfolioImages", file);
      });
      await uploadPortfolioImage(formData).unwrap();
      setUploadFile(null);
      refetch();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  // Handle uploading the file and refresh portfolio after successful upload
  // const handleUpload = async () => {
  //   if (!uploadFile) return;

  //   try {
  //     const formData = new FormData();
  //     // If supporting multiple files, loop and append each file.
  //     // For now, we append one file:
  //     formData.append("portfolioImages", uploadFile);
  //     await uploadPortfolioImage(formData).unwrap();
  //     setUploadFile(null);
  //     // Refetch portfolio data to display the newly uploaded image
  //     refetch();
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     alert("Failed to upload image");
  //   }
  // };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            My Portfolio
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Showcase your best photography work
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <label className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Photos"}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === category.id
                  ? "text-purple-600 dark:text-purple-500 border-purple-600 dark:border-purple-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              {category.name}
              <span className="ml-2 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-300">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4">
          <div className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-3 sm:mb-0">
            {selectedImages.length}{" "}
            {selectedImages.length === 1 ? "image" : "images"} selected
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleFeatureSelected}
              className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2"
            >
              <Eye className="mr-1 h-3.5 w-3.5" />
              Feature
            </button>
            <button
              onClick={() => setSelectedImages([])}
              className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2"
            >
              Deselect All
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Trash className="mr-1 h-3.5 w-3.5" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      {portfolioLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`group relative rounded-lg overflow-hidden border ${
                selectedImages.includes(image.id)
                  ? "border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/20"
                  : "border-gray-200 dark:border-gray-700"
              } bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md`}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Featured badge */}
                {image.featured && (
                  <div className="absolute top-2 left-2 rounded-full bg-purple-600 px-2 py-0.5 text-xs font-medium text-white">
                    Featured
                  </div>
                )}

                {/* Selection checkbox */}
                <div className="absolute top-2 right-2">
                  <div
                    className={`h-5 w-5 rounded border ${
                      selectedImages.includes(image.id)
                        ? "border-purple-500 bg-purple-500"
                        : "border-white bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    } cursor-pointer transition-opacity`}
                    onClick={() => toggleImageSelection(image.id)}
                  >
                    {selectedImages.includes(image.id) && (
                      <svg
                        className="h-full w-full text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-medium text-white truncate">
                    {image.title}
                  </h3>
                  <div className="flex gap-1">
                    <button className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/30">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/30">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {image.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {image.date}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {image.category}
                </p>
              </div>
            </div>
          ))}

          {/* Upload Card */}
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 mb-3">
              <Camera className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Add more photos
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Upload new images to your portfolio
            </p>
            <label className="mt-4 inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer">
              <Upload className="mr-1 h-3.5 w-3.5" />
              Upload
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            {uploadFile && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                  {uploadFile.name}
                </span>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="text-xs text-purple-600 hover:text-purple-700"
                >
                  {isUploading ? "Uploading..." : "Upload Now"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
            <Camera className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No photos found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {activeTab === "all"
              ? "You haven't uploaded any photos yet."
              : `You don't have any photos in the ${activeTab} category.`}
          </p>
          <label className="mt-6 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </DashboardLayout>
  );
}
