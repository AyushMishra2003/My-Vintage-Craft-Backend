import slugify from 'slugify'
import ProductCategoryModel from '../models/productCategory.model.js'
import AppError from '../utlis/error.utlis.js'
import { all } from 'axios'

const addProductCategory = async (req, res, next) => {
  try {
    const { category } = req.body

    if (!category) {
      return next(new AppError("Category is Required", 400))
    }

    const existingCategory = await ProductCategoryModel.findOne({ category });
    if (existingCategory) {
      return next(new AppError("Category already exists", 400));
    }

    const addCategory = await ProductCategoryModel.create({
      category,
      categorySlug: slugify(category, { lower: true, strict: true }),
    })


    await addCategory.save()



    res.status(200).json({
      success: true,
      message: "Product Category Added Succesfully",
      data: addCategory
    })


  } catch (error) {
    console.log(error);

    return next(new AppError(error.message, 500))
  }
}


const getProductCategory = async (req, res, next) => {
  try {

    const allProductCategory = await ProductCategoryModel.find({})

    if (!allProductCategory) {
      return next(new AppError("Product Category Not Found", 400))
    }




    res.status(200).json({
      success: true,
      message: "Product Category Found",
      data: allProductCategory
    })

  } catch (error) {
    return next(new AppError(error.message, 500))
  }
}


const getProductSubCategory = async (req, res, next) => {
  try {

    const { category } = req.params



    const allProductCategory = await ProductCategoryModel.find({ categorySlug: category })


    if (!allProductCategory) {
      return next(new AppError("Product Category Not Found", 400))
    }


    const subCategory = allProductCategory.map((item) => item.subCategory).flat();


    res.status(200).json({
      success: true,
      message: "Product Category Found",
      data: subCategory
    })

  } catch (error) {
    return next(new AppError(error.message, 500))
  }
}


const editCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const { category } = req.body

    const validCategory = await ProductCategoryModel.findById(id)

    if (!validCategory) {
      return next(new AppError("Category is Not Valid", 400))
    }

    if (category) {
      validCategory.category = category
      validCategory.categorySlug = slugify(category, { lower: true, strict: true });
    }

    await validCategory.save()


    res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      data: validCategory
    })

  } catch (error) {
    return next(new AppError(error.message, 500))
  }

}


const deleteCategory = async (req, res, next) => {
  try {

    const { id } = req.params


    const deletedCategory = await ProductCategoryModel.findByIdAndDelete(id);

    if (!deleteCategory) {
      return next(new AppError("Category Not Found", 400))
    }

    res.status(200).json({
      success: true,
      message: "Product Category Delete Succesfully",
    })


  } catch (error) {
    return next(new AppError(error.message, 500))
  }
}



const addProductSubCategory = async (req, res, next) => {
  try {

    const { category } = req.params
    const { subCategory } = req.body


    // console.log("params is",req.params);
    
       console.log("param  baba is ",category);
       



    const validCategory = await ProductCategoryModel.findOne({ categorySlug: category })

    if (!validCategory) {
      return next(new AppError("Category Not Found", 400))
    }



    // Initialize subCategory if it's undefined
    if (!Array.isArray(validCategory.subCategory)) {
      validCategory.subCategory = [];
    }

    // Check for duplication
    if (validCategory.subCategory.includes(subCategory)) {
      return next(new AppError("SubCategory already exists", 400));
    }

    // Push the new subCategory
    validCategory.subCategory.push(subCategory);

    console.log("tera nama hoga",validCategory);
    

// // 
    await validCategory.save()

    res.status(200).json({
      success: true,
      message: "Sub Category Added Succesfully",
      data: validCategory
    })


  } catch (error) {
    console.log(error);

    return next(new AppError(error.message, 500))
  }
}


const editProductSubCategory = async (req, res, next) => {
  try {
  const { name } = req.params

  console.log(name);
  
    const { oldSubCategory, subCategory } = req.body;

    // Validate category existence
       const validCategory = await ProductCategoryModel.findOne({ categorySlug: name })

    if (!validCategory) {
      return next(new AppError("Product Category Not Found", 400));
    }

    // Find subcategory index
    const subCategoryIndex = validCategory.subCategory.indexOf(oldSubCategory);

    if (subCategoryIndex === -1) {
      return next(new AppError("Subcategory Not Found", 400));
    }

    // Replace oldSubCategory with newSubCategory
    validCategory.subCategory[subCategoryIndex] = subCategory;

    // Save changes
    await validCategory.save();

    res.status(200).json({
      success: true,
      message: "Subcategory Updated Successfully",
      data: validCategory,
    });

  } catch (error) {
    console.log(error);
    
    return next(new AppError(error.message, 500));
  }
};


const removeProductSubCategort = async (req, res, next) => {
  try {

    const { name} = req.params
    const { subCategory } = req.body

    console.log("ayush mishra");
    

    const validCategory = await ProductCategoryModel.findOne({ categorySlug: name })

    if (!validCategory) {
      return next(new AppError("Category Not Found", 404))
    }

    if (!subCategory) {
      return next(new AppError("Require Sub Category Found", 404))
    }

    const updatedCategory = await ProductCategoryModel.findOneAndUpdate(
      { categorySlug: name },
      { $pull: { subCategory: subCategory } }, // removes subCategory from the array
      { new: true }
    );


    if (!updatedCategory) {
      return next(new AppError("Sub Category Not Delete", 400))
    }

    // if (!validCategory.subCategory.includes(subCategory)) {
    //   return next(new AppError("SubCategory does not exist", 400));
    // }

    // validCategory.subCategory = validCategory.subCategory.filter(
    //   (item) => item !== subCategory
    // );

    // validCategory.save()

    res.status(200).json({
      success: true,
      message: "Remove Product Sub Category"
    })



  } catch (error) {
    console.log(error);
    
    return next(new AppError(error.message, 500))
  }
}



export { addProductCategory, getProductCategory, editCategory, deleteCategory, addProductSubCategory, editProductSubCategory, removeProductSubCategort, getProductSubCategory }
