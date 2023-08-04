import { Router } from "express";
import {check} from 'express-validator'

import { validarCampos } from "../middlewares/validar-campos.js";
import { emailExiste, esRoleValido } from "../helpers/db-validator.js";
import { UsuarioPut, usuariosGet, usuariosPacientesGet, usuariosPost } from "../controller/paciente.js";

export const router=Router()

router.get('/', usuariosGet );

router.get('/:id', usuariosPacientesGet );

router.put('/:id',[
    validarCampos
], UsuarioPut)

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ), 
    validarCampos
], usuariosPost );
