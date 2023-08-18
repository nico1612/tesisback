import pkg from 'mongoose';
const {Schema, model} = pkg;

const ConsultaSchema = Schema({
    usuario: {
        type: String,
        required: [true, 'El usuario es obligatorio']
    },
    resultadoDA: {
        type: Number,
        required: [true, 'El resultado es obligatoria'],
    },
    img: {
        type: String,
    },
    dia:{
        type:String,
    },
    mes:{
        type:String,
    },
    ano:{
        type:String,
    }
});

export const Consulta= model("consulta",ConsultaSchema)