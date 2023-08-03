import { Router } from "express";
import {check} from 'express-validator'
import { actualizarImagenCloudinary, cargarArchivo } from "../controller/uploads.js";

export const routerUploads = Router()

routerUploads.post("/files/:id",cargarArchivo)

routerUploads.put("/files/:id", actualizarImagenCloudinary)