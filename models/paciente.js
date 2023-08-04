import pkg from 'mongoose';
const {Schema, model} = pkg;

const PacienteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['MEDICO_ROLE',"ADMIN_ROL"]
    },
    estado: {
        type: Boolean,
        default: true
    },
});

PacienteSchema.methods.toJSON = function() {
    const { __v, password, _id, ...paciente  } = this.toObject();
    paciente.uid = _id;
    return paciente;
}

export const Paciente= model("paciente",PacienteSchema)