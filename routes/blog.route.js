import { Router } from "express";
import { addBlog, deleteBlog, editBlog, getAllBlogs, getBlogDetail } from "../controller/Blog.controller.js";
import upload from "../middleware/multer.middleware.js";

const blogRoute=Router()


blogRoute.post("/",upload.single("blogPhoto"),addBlog)
blogRoute.get("/",getAllBlogs)
blogRoute.get("/:slug",getBlogDetail)
blogRoute.put("/:id",upload.single("blogPhoto"),editBlog)
blogRoute.delete("/:id",deleteBlog)


export default blogRoute