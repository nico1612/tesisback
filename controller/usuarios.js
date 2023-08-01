import { request, response } from "express";
import bcryptjs from 'bcryptjs';

import { Usuario } from "../models/usuario.js";

export const usuariosGet = async(req = request, res = response) => {
    const usuario = await Usuario.find();
    res.json({
        usuario,
    });
}

export const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });

}