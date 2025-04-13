import React, { useState } from "react";
import { Camera, Edit, Trash2, Upload, X, Star } from "lucide-react";

export default function PhotographerPortfolioPage() {
  // Mock portfolio data
  const [portfolioImages, setPortfolioImages] = useState([
    {
      id: 1,
      url: "/placeholder.svg?height=600&width=800&text=Portfolio+1",
      title: "Urban Portrait",
      category: "Portrait",
      featured: true,
    },
    {
      id: 2,
      url: "/placeholder.svg?height=600&width=800&text=Portfolio+2",
      title: "Fashion Editorial",
      category: "Fashion",
      featured: true,
    },
    {
      id: 3,
      url: "/placeholder.svg?height=600&width=800&text=Portfolio+3",
      title: "Wedding Ceremony",
      category: "Wedding",
      featured: false,
    },
    {
      id: 4,
      url: "/placeholder.svg?height=600&width=800&text=Portfolio+4",
      title: "Family Portrait",
      category: "Family",
      featured: false,
    },
    {
      id: 5,
      url: "/placeholder.svg?height=600&width=800&text=Portfolio+5",
      title: "Product Photography",
      category: "Commercial",
      featured: false,
    },
    {
      id: 6,
      url: "/placeholder.svg?height=600&width=800&text=Portfolio+6",
      title: "Landscape",
      category: "Landscape",
      featured: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [editingImage, setEditingImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newImage, setNewImage] = useState({
    title: "",
    category: "Portrait",
  });

  // Filter images based on active tab
  const filteredImages =
    activeTab === "all"
      ? portfolioImages
      : activeTab === "featured"
      ? portfolioImages.filter((img) => img.featured)
      : portfolioImages.filter((img) => img.category === activeTab);

  const handleDeleteImage = (id) => {
    setPortfolioImages(portfolioImages.filter((img) => img.id !== id));
  };

  const handleToggleFeatured = (id) => {
    setPortfolioImages(
      portfolioImages.map((img) =>
        img.id === id ? { ...img, featured: !img.featured } : img
      )
    );
  };

  const handleEditImage = (image) => {
    setEditingImage({ ...image });
  };

  const handleSaveEdit = () => {
    setPortfolioImages(
      portfolioImages.map((img) =>
        img.id === editingImage.id ? editingImage : img
      )
    );
    setEditingImage(null);
  };

  const handleUploadImage = () => {
    // In a real app, this would upload the image to a server
    const newId = Math.max(...portfolioImages.map((img) => img.id)) + 1;
    setPortfolioImages([
      ...portfolioImages,
      {
        id: newId,
        url: "/placeholder.svg?height=600&width=800&text=New+Image",
        title: newImage.title,
        category: newImage.category,
        featured: false,
      },
    ]);
    setNewImage({ title: "", category: "Portrait" });
    setShowUploadModal(false);
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">My Portfolio</h1>
          <p className="text-gray-600">Manage your photography portfolio</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="mr-2 inline h-4 w-4" />
            Upload New Photos
          </button>
        </div>
      </div>

      {/* Portfolio Gallery Card */}
      <div className="border rounded shadow">
        <div className="border-b p-4">
          <h3 className="text-lg font-bold">Portfolio Gallery</h3>
          <p className="text-gray-600">
            Showcase your best work to attract clients
          </p>
        </div>
        <div className="p-4">
          {/* Tabs List */}
          <div className="grid w-full grid-cols-6 gap-2">
            {[
              "all",
              "featured",
              "Portrait",
              "Fashion",
              "Wedding",
              "Commercial",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab
                    ? "bg-gray-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className="mt-6">
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg border"
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white">
                          {image.title}
                        </h3>
                        <p className="text-sm text-gray-200">
                          {image.category}
                        </p>
                      </div>
                      <div className="absolute right-2 top-2 flex gap-2">
                        <button
                          className="h-8 w-8 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                          onClick={() => handleEditImage(image)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="h-8 w-8 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                          onClick={() => handleToggleFeatured(image.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              image.featured
                                ? "fill-yellow-400 text-yellow-400"
                                : ""
                            }`}
                          />
                        </button>
                        <button
                          className="h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
                <Camera className="h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">
                  No images in this category
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Upload new photos to showcase your work
                </p>
                <button
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  onClick={() => setShowUploadModal(true)}
                >
                  Upload Photos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Edit Image</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setEditingImage(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <img
                  src={editingImage.url || "/placeholder.svg"}
                  alt={editingImage.title}
                  className="h-40 w-full object-cover rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="edit-title"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={editingImage.title}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="edit-category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="edit-category"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={editingImage.category}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Family">Family</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="edit-featured"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={editingImage.featured}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      featured: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="edit-featured"
                  className="text-sm text-gray-700"
                >
                  Featured Image
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="border rounded px-4 py-2 text-sm"
                  onClick={() => setEditingImage(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Upload New Photo</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setShowUploadModal(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop your image here, or click to browse
                  </p>
                  <input type="file" className="hidden" />
                  <button className="mt-4 border rounded px-4 py-2 text-sm">
                    Select File
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="upload-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="upload-title"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={newImage.title}
                  onChange={(e) =>
                    setNewImage({ ...newImage, title: e.target.value })
                  }
                  placeholder="Enter image title"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="upload-category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="upload-category"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={newImage.category}
                  onChange={(e) =>
                    setNewImage({ ...newImage, category: e.target.value })
                  }
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Family">Family</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="border rounded px-4 py-2 text-sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                  onClick={handleUploadImage}
                  disabled={!newImage.title}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
