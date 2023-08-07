import { response } from "express";
import { Solicitud } from "../models/solicitud.js";
import { Relacion } from "../models/relacion.js";

export const solicitudPost = async(req, res = response) => {

    
    const { receptor, emisor } = req.body;

    let estado = true;

    // Buscar si existe alguna solicitud con los mismos valores de receptor y emisor
    const solicitudExistente = await Solicitud.findOne({ receptor, emisor });
    
    if (solicitudExistente !=null) {

    // Si la solicitud ya existe, puedes manejar el resultado según tus necesidades.
    return res.status(400).json({ message: 'La solicitud ya existe en la base de datos.' });
    }

 
    const relacion = await Relacion.find({
        $or: [ { medico: receptor, paciente:receptor,medico:emisor , paciente:emisor}],
        $and: [{ estado: true }]
    })

    // Si no existe una solicitud con los mismos valores, procede a guardarla en BD
    if(relacion.length>0){
        return res.status(400).json({ message: 'La relacion ya existe en la base de datos.' });
    }
    const solicitud = new Solicitud({ receptor, emisor, estado });

    try {
    await solicitud.save();
    return res.status(201).json({ message: 'Solicitud guardada exitosamente.' });
    } catch (error) {
    return res.status(500).json({ message: 'Error al guardar la solicitud en la base de datos.' });
    }

}
