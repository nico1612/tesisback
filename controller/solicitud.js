import { response } from "express";
import { Solicitud } from "../models/solicitud.js";

export const solicitudPost = async(req, res = response) => {

    const { receptor,emisor } = req.body;
    let estado="espera"
    const solicitud = new Solicitud({ receptor,emisor,estado });

    // Guardar en BD
    await solicitud.save();

    res.json({
        solicitud
    });

}
