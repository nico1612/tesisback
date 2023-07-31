import pkg from 'mongoose';
const {Schema, model} = pkg;

const solicitudSchema = Schema({
    receptor: {
        type: String,
        required: [true, 'El receptor es obligatorio']
    },
    emisor:{
        type:String,
        require:[true,'El emisor es obligatorio']
    },
    estado:{
        type:String,
        require:[true,'El estado es obligatorio']
    }
});

export const Solicitud= model("solicutud",solicitudSchema)