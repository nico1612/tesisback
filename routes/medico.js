import { Router } from "express";
import {check} from 'express-validator'

import { medicoPost, medicosGet, medicosPut } from "../controller/medico.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { emailExiste, esRoleValido, existeMedicoPorId } from "../helpers/db-validator.js";
export const routerMedico=Router()

routerMedico.get('/',medicosGet)

routerMedico.put('/:id',[
    validarCampos
], medicosPut)

routerMedico.post('/:id',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('licencia','Debe existir licencia').not().isEmpty(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ), 
    validarCampos
], medicoPost );
