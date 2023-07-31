import pkg from 'mongoose';
const {Schema, model} = pkg;

const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido:{
        type:String,
        require:[true,'El apellido es obligatorio']
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
    licencia: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'MEDICO_ROLE',
        emun: ['MEDICO_ROLE',]
    },
    estado: {
        type: Boolean,
        default: false
    },
});

MedicoSchema.methods.toJSON = function() {
    const { __v, password, _id, ...medico  } = this.toObject();
    medico.uid = _id;
    return medico;
}

export const Medico= model("medico",MedicoSchema)