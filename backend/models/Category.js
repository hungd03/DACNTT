const mongoose = require("mongoose");
const slugGenerator = require("mongoose-slug-updater");

mongoose.plugin(slugGenerator);

const categorySchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    order: { type: Number, require: true },
    name: { type: String, trim: true, required: true },
    slug: { type: String, slug: "name", slugPaddingSize: 2, unique: true },
    image: {
      url: String,
      publicId: String,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isHide: { type: Boolean, required: true, default: false },
    countProduct: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Define statics before creating the model
categorySchema.statics.generateOrder = async function () {
  const item = await this.findOne()
    .select("order")
    .sort("-order")
    .lean()
    .exec();
  const order = parseInt(item?.order, 10) || 0;
  return order + 1;
};

const autoPopulateChildren = function (next) {
  if (this.getOptions().skipPopulate) {
    return next();
  }
  const populateOpts = [
    {
      path: "children",
      select: this._fields,
      model: "Category",
    },
  ];

  this.populate(populateOpts);
  next();
};

categorySchema
  .pre("findOne", autoPopulateChildren)
  .pre("find", autoPopulateChildren);

module.exports = mongoose.model("Category", categorySchema);
