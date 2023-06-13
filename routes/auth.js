import {Router} from 'express'
import {check} from 'express-validator'

//import {validarJWT} from '../middlewares/validar-jwt.js';
import { login } from '../controller/auth.js';
import { validarCampos } from '../middlewares/validar-campos.js';

export const routerAuth = Router();

routerAuth.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );