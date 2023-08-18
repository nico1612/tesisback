import bcryptjs from 'bcryptjs';
import { Medico } from "../models/medico.js";
import { Relacion } from '../models/relacion.js';

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
    const {medico } = req.body;
   const { uid, password, correo, ...resto }=medico
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const medicos = await Medico.findByIdAndUpdate(uid, resto);

    res.json({ medicos });
};

export const medicoPost = async (req, res = response) => {
    const { nombre, apellido, correo, password, rol, licencia } = req.body;

    try {
        // Buscar si ya existe un médico con el mismo correo
        const medicoExistente = await Medico.findOne({ correo });

        if (medicoExistente) {
            return res.status(400).json({ mensaje: "Ya existe un médico con este correo" });
        }

        // Crear un nuevo médico
        const medico = new Medico({ nombre, apellido, correo, password, rol, licencia });

        const salt = bcryptjs.genSaltSync();
        medico.password = bcryptjs.hashSync(password, salt);

        await medico.save();
        res.json({ medico });
    } catch (error) {
        console.error("Error al crear el médico:", error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
};
export const medicosIdGet = async (req, res = response) => {
    try {
        const { id } = req.params;
        const medicos = [];
        const regex = new RegExp(id, 'i');
        const relaciones = await Relacion.find({ $or: [{ paciente: regex }] });

        // Usamos Promise.all para esperar a que todas las promesas se resuelvan
        await Promise.all(
            relaciones.map(async (relacion) => {
                const medico = await Medico.findById(relacion.medico);
                medicos.push(medico);
            })
        );

        res.json({ medico: medicos });
    } catch (error) {
        res.status(500).json({ error: 'Ha ocurrido un error en el servidor.' });
    }
};


export const eliminarMedico = async (req, res = response) => {
    const { id } = req.params;
  
    try {
      // Buscar y eliminar el usuario por su ID
      const medicoEliminado = await Medico.findByIdAndRemove(id);
  
      if (!medicoEliminado) {
        return res.status(404).json({ mensaje: "medico no encontrado" });
      }
  
      res.json({ mensaje: "Medico eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ mensaje: "Error del servidor" });
    }
  };