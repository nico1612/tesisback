import { request, response } from "express";
import bcryptjs from 'bcryptjs';

import { Relacion } from "../models/relacion.js";
import { Paciente } from "../models/paciente.js";
import { Consulta } from "../models/consulta.js";

export const usuariosGet = async(req = request, res = response) => {

    const usuario = await Paciente.find();

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
    const relacionesUnicasSet = new Set();

    for (const relacion of relaciones) {
        const relacionString = JSON.stringify(relacion);
        relacionesUnicasSet.add(relacionString);
    }

    const relacionesUnicas = Array.from(relacionesUnicasSet).map((relacionString) => JSON.parse(relacionString));

    const usuariosSet = new Set(); // Conjunto para almacenar usuarios únicos

    for (const relacion of relacionesUnicas) {
        const usuario = await Paciente.findById(relacion.paciente);
        usuariosSet.add(usuario);
    }

    const usuarios = Array.from(usuariosSet);

    res.json({ usuarios: usuarios });
}

export const usuariosPost = async(req, res = response) => {

    const { nombre, apellido, correo, password, rol } = req.body;
    const usuario = new Paciente({ nombre,apellido, correo, password, rol });

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

    const usuario = await Paciente.findByIdAndUpdate(uid, resto);

    res.json({  usuario });
};

export const UsuarioEstadisticasTotales = async (req, res = response) => {
    const { id } = req.params;

    try {
        const consultas = await Consulta.find({ usuario: id });

        if (consultas.length > 0) {
            let psiorasis = 0;
            let dermatitisAtopica = 0;
            let dermatitisDeContacto = 0;
            let otros =0

            consultas.forEach((consulta) => {
                if (consulta.resultado === "psiorasis") {
                    psiorasis++;
                } else if (consulta.resultado === "dermatitis atopica") {
                    dermatitisAtopica++;
                } else if (consulta.resultado === "dermatitis de contacto") {
                    dermatitisDeContacto++;
                }
                else{
                    otros=otros+1
                }
            });

            const total=psiorasis+dermatitisAtopica+dermatitisDeContacto+otros
            const porcentajePsiorasis=psiorasis/total*100
            const porcentajeDermatitisAtopica=dermatitisAtopica/total*100
            const porcentajDermatitisDeContacto=dermatitisDeContacto/total*100
            const porcentajeOtros=otros/total*100

            return res.json({ resultados: { psiorasis, dermatitisAtopica, dermatitisDeContacto,otros,total, porcentajePsiorasis, porcentajeDermatitisAtopica, porcentajDermatitisDeContacto, porcentajeOtros} });
        }

        return res.json({ resultado: "sin consultas" });
    } catch (error) {
        console.error("Error al buscar las consultas:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};