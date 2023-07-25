import { response } from "express";
import mongoose from "mongoose";
import { Usuario } from "../models/usuario.js";

const ObjectId = mongoose.Types.ObjectId

const coleccionesPermitidas=[
    'usuarios',
]

const buscarUsuarios=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino)

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuario = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    return res.json({
        results: usuario
    });
}

export const buscar=(req, res=response)=>{

    const {coleccion,termino}=req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son  ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino,res)
            break
        default:
            res.status(500).json({
                msg:'se me olvido hacer esta busqueda'
            })
    }

}