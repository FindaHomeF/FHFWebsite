'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const ImageUpload = ({ 
  multiple = false, 
  onUpload, 
  placeholder = "Upload Image here", 
  subtitle = "High quality images only",
  required = false,
  maxFiles = 5,
  existingImages = [] // For edit mode - accepts array of URLs
}) => {
  const [files, setFiles] = useState([])
  const [existingImgs, setExistingImgs] = useState(existingImages || [])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setExistingImgs(existingImages)
    }
  }, [existingImages])

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles)
    const validFiles = fileArray.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select only image files')
        return false
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) {
      return
    }

    if (multiple) {
      const newFiles = [...files, ...validFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onUpload(newFiles)
      toast.success('Images uploaded successfully')
    } else {
      setFiles([validFiles[0]])
      onUpload(validFiles[0])
      toast.success('Image uploaded successfully')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onUpload(multiple ? newFiles : newFiles[0] || null)
    toast.info('Image removed')
  }

  const removeExistingImage = (index) => {
    const newImgs = existingImgs.filter((_, i) => i !== index)
    setExistingImgs(newImgs)
    onUpload(multiple ? newImgs : newImgs[0] || null)
    toast.info('Image removed')
  }

  const replaceExistingImage = (index) => {
    fileInputRef.current.click()
    // Store the index to replace after file selection
    fileInputRef.current.dataset.replaceIndex = index
  }

  const openFileDialog = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files
    const replaceIndex = fileInputRef.current.dataset.replaceIndex
    
    if (replaceIndex !== undefined && replaceIndex !== '') {
      // Replace existing image
      const fileArray = Array.from(selectedFiles)
      const validFile = fileArray[0]
      
      if (validFile && validFile.type.startsWith('image/') && validFile.size <= 5 * 1024 * 1024) {
        const newImgs = [...existingImgs]
        newImgs[parseInt(replaceIndex)] = validFile
        setExistingImgs(newImgs)
        onUpload(multiple ? newImgs : newImgs[0])
        toast.success('Image updated successfully')
      }
      fileInputRef.current.dataset.replaceIndex = ''
    } else {
      handleFileSelect(selectedFiles)
    }
    
    // Reset input
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-black10 hover:border-gray-400'
        }`}
        role="button"
        tabIndex={0}
        aria-label={multiple ? 'Upload listing images' : 'Upload listing image'}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openFileDialog()
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">{placeholder}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Display existing images (for edit mode) */}
      {existingImgs.length > 0 && (
        <div className="space-y-2">
          {existingImgs.map((image, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2 flex-1">
                <img
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={`Existing ${index + 1}`}
                  className="w-8 h-8 object-cover rounded"
                />
                <span className="text-sm text-gray-700 truncate">
                  {typeof image === 'string' ? `Image ${index + 1}` : image.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    replaceExistingImage(index)
                  }}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Replace image"
                  aria-label={`Replace image ${index + 1}`}
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeExistingImage(index)
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove image"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display uploaded files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2 flex-1">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-8 h-8 object-cover rounded"
                />
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove image"
                aria-label={`Remove uploaded image ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
