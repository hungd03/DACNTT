const cloudinary = require("../configs/cloudinaryConfig");

class UploadService {
  // Delete Methods
  async deleteImage(publicId) {
    if (!publicId) return;

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new Error("Failed to delete image");
    }
    return result;
  }

  async deleteMultipleImages(publicIds) {
    if (!publicIds || publicIds.length === 0) return;

    const deletePromises = publicIds.map((publicId) =>
      this.deleteImage(publicId)
    );

    await Promise.all(deletePromises);
  }
}

module.exports = new UploadService();
