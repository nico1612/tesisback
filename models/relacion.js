import pkg from 'mongoose';
const {Schema, model} = pkg;

const RelacionSchema = Schema({
    medico: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    paciente:{
        type:String,
        require:[true,'El apellido es obligatorio']
    },
});


export const Relacion= model("relacion",RelacionSchema)