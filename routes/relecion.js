import { Router } from "express";
import { check } from "express-validator";
import { relacionPost } from "../controller/relacion.js";

export const routerRelacion=Router()

routerRelacion.post("/",[
    check('receptor', 'El receptor es obligatorio').not().isEmpty(),
    check('emisor', 'El emisor es obligatorio').not().isEmpty(),
],relacionPost)