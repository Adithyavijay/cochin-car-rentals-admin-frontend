const ImagePreview: React.FC<{ images: string[], label: string }> = ({ images, label }) => (
    <div className="mt-2">
      <p className="text-sm text-gray-600 mb-2">{label}:</p>
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <img key={index} src={url} alt={`${label} ${index + 1}`} className="h-32 object-contain rounded" />
        ))}
      </div>
    </div>
  ); 

  export default ImagePreview ;