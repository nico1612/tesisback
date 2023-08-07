import pkg from 'mongoose';
const {Schema, model} = pkg;

const MensajeSchema = Schema({
    mensaje: {
        type: String,
        required: [true, 'El mensaje es obligatorio']
    },
    emisor: {
        type: String,
        required: [true, 'El emisor es obligatorio']
    },
    receptor: {
        type: String,
        required: [true, 'El receptor es obligatorio'],
        unique: true
    },
   
});

export const Mensaje= model("mensaje",MensajeSchema)