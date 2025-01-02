const mongoose = require("mongoose");
const slugGenerator = require("mongoose-slug-updater");

const specificationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    key: { type: String, slug: "name", required: false },
    values: [{ type: String, trim: true, required: true }],
  },
  { timestamps: false, id: false, _id: false }
);

const variantSchema = new mongoose.Schema({
  sku: { type: String, trim: true, required: true },
  color: { type: String, required: true },
  storage: { type: Number, required: true },
  ram: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  variantImage: {
    url: { type: String, trim: true, require: true },
    publicId: { type: String, trim: true, require: true },
  },
  soldCount: { type: Number, default: 0 },
});

const videosSchema = new mongoose.Schema({
  videoProvider: { type: String, trim: true, required: true },
  videoLink: { type: String, trim: true, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: "name", slugPaddingSize: 2, unique: true },
    brand: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    description: { type: String, required: true },
    overSpecs: [specificationSchema],
    variants: [variantSchema],
    videos: [videosSchema],

    // Pricing và Sorting
    basePrice: { type: Number, required: true },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    discount: {
      type: { type: String, enum: ["percentage", "fixed"] },
      value: { type: Number },
      startDate: { type: Date },
      endDate: { type: Date },
      isActive: { type: Boolean, default: false },
    },

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    // Trạng thái
    status: {
      type: String,
      enum: ["Active", "Inactive", "Out of stock"],
      required: true,
    },

    // Media
    thumbnailImage: {
      url: { type: String },
      publicId: { type: String },
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
  },
  { timestamps: true }
);

[specificationSchema, productSchema].forEach((s) => {
  s.plugin(slugGenerator);
});

// Pre-save middleware để tính minPrice và maxPrice
productSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    const prices = this.variants.map((v) => v.price);
    this.minPrice = Math.min(...prices);
    this.maxPrice = Math.max(...prices);
  } else {
    this.minPrice = this.basePrice;
    this.maxPrice = this.basePrice;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
