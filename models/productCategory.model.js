import { model, Schema } from "mongoose";
import slugify from "slugify"; // Import slugify

const productCategorySchema = new Schema(
    {
        category: {
            type: String,
            required: true,
            trim: true
        },
        subCategory: [
            {
                type: String,
                trim: true
            }
        ],
        categorySlug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true 
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

// Create an index on categorySlug for faster lookup
productCategorySchema.index({ categorySlug: 1 });

const ProductCategoryModel = model("ProductCategory", productCategorySchema);

export default ProductCategoryModel;
