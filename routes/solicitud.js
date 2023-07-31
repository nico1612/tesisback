import { Router } from "express";
import {check} from 'express-validator'

import { validarCampos } from "../middlewares/validar-campos.js";
import { solicitudPost } from "../controller/solicitud.js";

export const routerSolicitud=Router()

//routerSolicitud.get('/',  );

routerSolicitud.post('/',[
    check('receptor', 'El receptor es obligatorio').not().isEmpty(),
    check('emisor', 'El emisor es obligatorio').not().isEmpty(),

    validarCampos
], solicitudPost);
