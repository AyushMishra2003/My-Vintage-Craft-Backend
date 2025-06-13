import { model, Schema } from "mongoose";
import slugify from "slugify";

const productCategorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: [
      {
        type: String,
        trim: true,
      },
    ],
    categorySlug: {
      type: String,
      required: true,
      trim: true,
      unique: true, // creates unique index
    },
  },
  {
    timestamps: true,
  }
);

// Pre-Save Middleware
productCategorySchema.pre("save", function (next) {
  if (this.isModified("category")) {
    this.categorySlug = slugify(this.category, { lower: true, strict: true });
  }
  next();
});

// Pre-Update Middleware
productCategorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.category) {
    update.categorySlug = slugify(update.category, { lower: true, strict: true });
  }
  next();
});

// 🚫 REMOVE THIS to avoid duplicate index warning:
// productCategorySchema.index({ categorySlug: 1 });

const ProductCategoryModel = model("ProductCategory", productCategorySchema);

export default ProductCategoryModel;
