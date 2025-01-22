const Product = require("../models/Product");
const ProductService = require("../services/productService");
const Cart = require("../models/Cart");

const SELECTED_FIELDS =
  "name variants.sku variants.color variants.price variants.variantImage.url";

const formatResult = (product, sku, quantity) => {
  if (!product) return null;
  const { variants, _id: productId, name } = product;
  const otherProductInfo = { name };
  const variantInfo = variants.find((v) => v.sku === sku);
  if (variantInfo) {
    return {
      productId,
      sku,
      quantity,
      ...otherProductInfo,
      ...variantInfo,
    };
  }

  return null;
};

async function getProductInfo(productId, sku) {
  const product = await ProductService.getProductById(productId);
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }
  const variant = product?.variants.find((v) => v.sku === sku);
  if (!variant) {
    throw new Error(`Variant Sku ${sku} of product ${productId} not found`);
  }

  return { product, variant };
}

class CartService {
  async getCartItemsFormData(items) {
    const filter = { _id: { $in: items.map((i) => i.productId) } };
    const products = await Product.find(filter)
      .select(SELECTED_FIELDS)
      .limit(items.length);

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const result = items.map(({ productId, sku, quantity }) => {
      const currentProduct = productMap.get(productId.toString());
      return formatResult(currentProduct, sku, quantity);
    });

    return result.filter((i) => i);
  }

  async getCartItemsByUser(userId) {
    const filter = { userId };
    const populateOpts = [
      {
        path: "items.productId",
        select: SELECTED_FIELDS,
        model: "Product",
      },
    ];
    const cart = await Cart.findOne(filter)
      .populate(populateOpts)
      .lean()
      .exec();
    return cart?.items
      ?.map((item) => formatResult(item.productId, item.sku, item.quantity))
      .filter((i) => i);
  }

  async addItemToCart(userId, productId, sku, quantity = 1) {
    const { product, variant } = await getProductInfo(productId, sku);

    const userCart = await Cart.findOne({ userId });
    if (!userCart) {
      const newCart = new Cart({
        userId,
        items: [{ productId, sku, quantity }],
      });
      await newCart.save();
    } else {
      const itemInCart = userCart.items.find(
        (i) => i.productId.toString() === productId && i.sku === sku
      );
      if (itemInCart) {
        itemInCart.quantity += quantity;
        quantity = itemInCart.quantity;
      } else {
        userCart.items.push({ productId, sku, quantity });
      }
      await userCart.save();
    }

    return formatResult(product, variant.sku, quantity);
  }

  async updateItemQuantity(userId, productId, sku, delta) {
    await getProductInfo(productId, sku);
    const userCart = await Cart.findOne({ userId });
    const item = userCart?.items?.find(
      (i) => i.productId.toString() === productId && i.sku === sku
    );
    if (!userCart || !item) {
      throw new Error("This item not exits in your cart");
    }
    item.quantity += delta;
    if (item.quantity <= 0) {
      return Cart.findByIdAndUpdate(userCart._id, {
        $pull: { items: { productId, sku } },
      });
    } else {
      return userCart.save();
    }
  }

  async removeItemFormCart(userId, productId, sku) {
    await getProductInfo(productId, sku);
    const userCart = await Cart.findOne({ userId });
    const item = userCart?.items?.find(
      (i) => i.productId.toString() === productId && i.sku === sku
    );
    if (!userCart || !item) {
      throw new Error("This item not exits in your cart");
    }
    return Cart.findByIdAndUpdate(
      userCart._id,
      { $pull: { items: { productId, sku } } },
      { new: true }
    );
  }

  async clearCart(userId) {
    const result = await Cart.findOneAndDelete({ userId });
    return !!result;
  }
}

module.exports = new CartService();
