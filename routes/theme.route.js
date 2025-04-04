import { Router } from "express";
import { addThemeCategory,getAllThemeCategory,themeUpdateCategory,delete_them } from "../controller/Theme.controller.js";
import upload from '../middleware/multer.middleware.js'



const themeRoute=Router()


themeRoute.post("/",upload.single("photo"),addThemeCategory)
themeRoute.get('/',getAllThemeCategory)
themeRoute.put('/:id',upload.single("photo"),themeUpdateCategory)
themeRoute.delete('/:id',delete_them)

export default themeRoute