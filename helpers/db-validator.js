
// Optimizar las importaciones utilizando destructuring
import { Medico } from "../models/medico.js";
import { Role } from "../models/role.js";
import { Paciente } from "../models/paciente.js";

// Función genérica para verificar si un documento existe por su ID
async function existeDocumentoPorId(model, id, mensajeError) {
    const existeDocumento = await model.findById(id);
    if (!existeDocumento) {
        throw new Error(`El id no existe ${id}`);
    }
}
// Verificar si el rol es válido
export async function esRoleValido(rol = '') {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

// Verificar si el usuario existe por su ID
export async function existeUsuarioPorId(id = '') {
    await existeDocumentoPorId(Paciente, id, `El id no existe ${id}`);
}

// Verificar si el médico existe por su ID
export async function existeMedicoPorId(id = '') {
    await existeDocumentoPorId(Medico, id, `El id no existe ${id}`);
}

// Verificar si el correo ya está registrado
export async function emailExiste(correo = '') {
    const existeEmail = await Paciente.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}