"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Edit, Trash2, Upload, X, Star } from "lucide-react"

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
  ])

  const [activeTab, setActiveTab] = useState("all")
  const [editingImage, setEditingImage] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newImage, setNewImage] = useState({
    title: "",
    category: "Portrait",
  })

  // Filter images based on active tab
  const filteredImages =
    activeTab === "all"
      ? portfolioImages
      : activeTab === "featured"
        ? portfolioImages.filter((img) => img.featured)
        : portfolioImages.filter((img) => img.category === activeTab)

  const handleDeleteImage = (id) => {
    setPortfolioImages(portfolioImages.filter((img) => img.id !== id))
  }

  const handleToggleFeatured = (id) => {
    setPortfolioImages(portfolioImages.map((img) => (img.id === id ? { ...img, featured: !img.featured } : img)))
  }

  const handleEditImage = (image) => {
    setEditingImage({ ...image })
  }

  const handleSaveEdit = () => {
    setPortfolioImages(portfolioImages.map((img) => (img.id === editingImage.id ? editingImage : img)))
    setEditingImage(null)
  }

  const handleUploadImage = () => {
    // In a real app, this would upload the image to a server
    const newId = Math.max(...portfolioImages.map((img) => img.id)) + 1
    setPortfolioImages([
      ...portfolioImages,
      {
        id: newId,
        url: "/placeholder.svg?height=600&width=800&text=New+Image",
        title: newImage.title,
        category: newImage.category,
        featured: false,
      },
    ])
    setNewImage({ title: "", category: "Portrait" })
    setShowUploadModal(false)
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">My Portfolio</h1>
          <p className="text-muted-foreground">Manage your photography portfolio</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowUploadModal(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Photos
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Gallery</CardTitle>
          <CardDescription>Showcase your best work to attract clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="Portrait">Portrait</TabsTrigger>
              <TabsTrigger value="Fashion">Fashion</TabsTrigger>
              <TabsTrigger value="Wedding">Wedding</TabsTrigger>
              <TabsTrigger value="Commercial">Commercial</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredImages.map((image) => (
                  <div key={image.id} className="group relative overflow-hidden rounded-lg border">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white">{image.title}</h3>
                        <p className="text-sm text-gray-200">{image.category}</p>
                      </div>
                      <div className="absolute right-2 top-2 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                          onClick={() => handleEditImage(image)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/80 text-gray-800 hover:bg-white"
                          onClick={() => handleToggleFeatured(image.id)}
                        >
                          <Star className={`h-4 w-4 ${image.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
                  <Camera className="h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No images in this category</h3>
                  <p className="mt-2 text-sm text-gray-500">Upload new photos to showcase your work</p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => setShowUploadModal(true)}>
                    Upload Photos
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Edit Image</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingImage(null)}>
                <X className="h-4 w-4" />
              </Button>
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
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingImage.category}
                  onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
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
                  onChange={(e) => setEditingImage({ ...editingImage, featured: e.target.checked })}
                />
                <Label htmlFor="edit-featured">Featured Image</Label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingImage(null)}>
                  Cancel
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
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
              <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop your image here, or click to browse</p>
                  <input type="file" className="hidden" />
                  <Button variant="outline" className="mt-4">
                    Select File
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-title">Title</Label>
                <Input
                  id="upload-title"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="Enter image title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-category">Category</Label>
                <select
                  id="upload-category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
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
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleUploadImage}
                  disabled={!newImage.title}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

