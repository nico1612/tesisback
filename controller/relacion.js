import { Relacion } from "../models/relacion.js";
import { Solicitud } from "../models/solicitud.js";

export const relacionPost = async (req, res = response) => {
    const { emisor, receptor, estado, mandado } = req.body;
    const regex = new RegExp(receptor, 'i');
    const regex2 = new RegExp(emisor, 'i');

    const solicitud = await Solicitud.findOneAndUpdate(
        { $or: [{ emisor: regex2 }, { receptor: regex }], estado: true },
        { estado: false },
        { new: true }
    );

    if (solicitud) {
        let medico, paciente;
        if (estado) {
            medico = mandado ? emisor : receptor;
            paciente = mandado ? receptor : emisor;
            const estado=true
            // Verificar si la relación ya existe
            const relacionExistente = await Relacion.findOne({ medico, paciente });

            if (!relacionExistente) {
                const relacion = new Relacion({ medico, paciente,estado });
                await relacion.save();
            }
        }
    }

    res.status(200).json({ mensaje: 'Respuesta exitosa con código de estado 200' });
};
