import { Router } from "express";
import {check} from 'express-validator'

import { validarCampos } from "../middlewares/validar-campos.js";
import { solicitudPost } from "../controller/solicitud.js";

export const routerSolicitud=Router()

routerSolicitud.post('/',[
    validarCampos
], solicitudPost);
