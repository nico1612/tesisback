import { request, response } from "express";
import bcryptjs from 'bcryptjs';

import { Relacion } from "../models/relacion.js";
import { Usuario } from "../models/usuario.js";

export const usuariosGet = async(req = request, res = response) => {

    const usuario = await Usuario.find();

    res.json({
        usuario,
    });
}

export const usuariosPacientesGet= async (req, res = response)=>{
    
    const { id } = req.params;

    const regex = new RegExp(id, 'i');
    const relaciones = await Relacion.find({
        $or: [{ medico: regex }]
    });
// Conjunto para almacenar relaciones únicas
const relacionesUnicasSet = new Set();

// Filtrar relaciones repetidas y agregar solo las únicas al conjunto
for (const relacion of relaciones) {
    const relacionString = JSON.stringify(relacion);
    relacionesUnicasSet.add(relacionString);
}

// Convertir el conjunto de relaciones únicas nuevamente a objetos
const relacionesUnicas = Array.from(relacionesUnicasSet).map((relacionString) => JSON.parse(relacionString));

const usuariosSet = new Set(); // Conjunto para almacenar usuarios únicos

// Recorrer las relaciones únicas y agregar usuarios únicos al conjunto
for (const relacion of relacionesUnicas) {
    const usuario = await Usuario.findById(relacion.paciente);
    usuariosSet.add(usuario);
}

// Convertir el conjunto de usuarios a un array
const usuarios = Array.from(usuariosSet);

    res.json({ usuarios: usuarios });
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

export const UsuarioPut = async (req, res = response) => {
    const { usuarios } = req.body;
    const { uid, password, correo, ...resto }=usuarios
    
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(uid, resto);

    res.json({  usuario });
};