import { Mensaje } from "../models/mensaje"


export const obtenerMensajes=async({_id})=>{

    const regex = new RegExp( _id, 'i' );
    const mensajes = await Mensaje.find({
        $or: [ { receptor: regex } , {emisor:regex}],
    })

    return mensajes
}