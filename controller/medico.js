import bcryptjs from 'bcryptjs';
import { Medico } from "../models/medico.js";

export const medicosGet = async (req, res = response) => {
    try {
        const medicos = await Medico.find();
        res.json({
            medicos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los médicos',
        });
    }
};

export const medicosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const medico = await Medico.findByIdAndUpdate(id, resto);
    res.json({ medico });
};

export const medicoPost = async (req, res = response) => {
    const { nombre, apellido, correo, password, rol, licencia } = req.body;
    
    const medico = new Medico({ nombre, apellido, correo, password, rol, licencia });

    const salt = bcryptjs.genSaltSync();
    medico.password = bcryptjs.hashSync(password, salt);

    await medico.save();
    res.json({ medico });
};
