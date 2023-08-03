import pkg from 'mongoose';
const {Schema, model} = pkg;

const ConsultaSchema = Schema({
    usuario: {
        type: String,
        required: [true, 'El usuario es obligatorio']
    },
    resultado: {
        type: String,
        required: [true, 'El resultado es obligatoria'],
    },
    img: {
        type: String,
    },
    date:{
        type:Date,
    }
});

export const Medico= model("medico",ConsultaSchema)