import { Router } from "express";
import { addContact, deleteContact, getContact } from "../controller/contact.controller.js";




const contactRouter=Router()

contactRouter.get("/",getContact)
contactRouter.post("/",addContact)
contactRouter.delete("/",deleteContact)

export default contactRouter