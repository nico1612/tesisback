import { response } from "express";
import { Solicitud } from "../models/solicitud.js";

export const solicitudPost = async(req, res = response) => {

    const { receptor, emisor } = req.body;
    let estado = true;

    // Buscar si existe alguna solicitud con los mismos valores de receptor y emisor
    const solicitudExistente = await Solicitud.findOne({ receptor, emisor });

    if (solicitudExistente) {
    // Si la solicitud ya existe, puedes manejar el resultado según tus necesidades.
    return res.status(409).json({ message: 'La solicitud ya existe en la base de datos.' });
    }

    // Si no existe una solicitud con los mismos valores, procede a guardarla en BD
    const solicitud = new Solicitud({ receptor, emisor, estado });

    try {
    await solicitud.save();
    return res.status(201).json({ message: 'Solicitud guardada exitosamente.' });
    } catch (error) {
    return res.status(500).json({ message: 'Error al guardar la solicitud en la base de datos.' });
    }

}
