import bcryptjs from 'bcryptjs';

import { generarJWT } from "../helpers/generar-jwt.js";
import { Paciente } from '../models/paciente.js';
import { Medico } from '../models/medico.js';

export const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Paciente.findOne({ correo }) || await Medico.findOne({ correo });

        if (!usuario || !usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};