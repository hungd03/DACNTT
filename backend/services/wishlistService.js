const Wishlist = require("../models/Wishlist");
const ProductService = require("../services/productService");

const SELECTED_FIELDS =
  "_id name slug basePrice thumbnailImage.url variants.stock variants.soldCount discount";

const formatResult = (product) => {
  if (!product) return null;
  const {
    _id: productId,
    name,
    slug,
    basePrice,
    thumbnailImage,
    variants,
    discount,
  } = product;
  return {
    productId,
    name,
    slug,
    basePrice,
    thumbnailImage,
    variants,
    discount,
  };
};

class WishlistService {
  async getWishlistItems(userId) {
    const populateOpts = [
      {
        path: "items.productId",
        select: SELECTED_FIELDS,
        model: "Product",
      },
    ];
    const wishlist = await Wishlist.findOne({ userId })
      .populate(populateOpts)
      .lean();
    return wishlist?.items
      ?.map((item) => formatResult(item.productId))
      .filter((i) => i);
  }

  async addItemToWishlist(userId, productId) {
    const product = await ProductService.getProductById(productId);

    if (!product) throw new Error(`Product ${productId} not found`);

    const userWishlist = await Wishlist.findOne({ userId });
    if (!userWishlist) {
      const newWishlist = new Wishlist({
        userId,
        items: [{ productId }],
      });
      await newWishlist.save();
    } else {
      userWishlist.items.push({ productId });
      await userWishlist.save();
    }

    return formatResult(product);
  }

  async removeItemFromWishlist(userId, productId) {
    const userWishlist = await Wishlist.findOne({ userId });
    const item = userWishlist?.items?.find(
      (i) => i.productId.toString() === productId
    );

    if (!userWishlist || !item) {
      throw new Error("This product not exist in your wishlist");
    }

    return Wishlist.findByIdAndUpdate(
      userWishlist._id,
      {
        $pull: { items: { productId } },
      },
      { new: true }
    );
  }

  async clearWishlistItems(userId) {
    const result = await Wishlist.findOneAndDelete({ userId });
    return !!result;
  }
}

module.exports = new WishlistService();
