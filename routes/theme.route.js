import { Router } from "express";
import { addThemeCategory } from "../controller/Theme.controller.js";
import upload from '../middleware/multer.middleware.js'



const themeRoute=Router()


themeRoute.post("/",upload.single("photo"),addThemeCategory)

export default themeRoute