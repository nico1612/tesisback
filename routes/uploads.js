import { Router } from "express";
import {check} from 'express-validator'
import { actualizarImagenCloudinary, } from "../controller/uploads.js";

export const routerUploads = Router()


routerUploads.put("/files", actualizarImagenCloudinary)

