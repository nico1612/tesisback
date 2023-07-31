import { response } from "express";
import mongoose from "mongoose";
import { Usuario } from "../models/usuario.js";
import { Medico } from "../models/medico.js";
import { Solicitud } from "../models/solicitud.js";
const ObjectId = mongoose.Types.ObjectId

const coleccionesPermitidas=[
    'usuarios',
    'medicos',
    'solicitud',
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

const buscarMedicos=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino)

    if(esMongoId){
        const medico = await Medico.findById(termino);
        return res.json({
            results: ( medico ) ? [ medico ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const medico = await Medico.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
    

    return res.json({
        results: medico
    });
}

const buscarSolicitud=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino)

    if(esMongoId){
        const solicitud = await Solicitud.findById(termino);
        return res.json({
            results: ( solicitud ) ? [ solicitud ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const solicitud = await Solicitud.find({
        $or: [ { receptor: regex }],
        $and: [{ estado: true }]
    })

    const regex2= new RegExp( solicitud.emisor, 'i' );
    const medico = await medico.find({
        $or: [{ nombre: regex2 }, { uid: regex2 }],
        $and: [{ estado: true }]
    })
    if(medico.lenght===0){
        const usuario = await Usuario.find({
            $or: [{ nombre: regex2 }, { correo: regex2 }],
            $and: [{ estado: true }]
        })
        return res.json({
            results: usuario
        });
    }
  
    return res.json({
        results: medico
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
        case 'medicos':
            buscarMedicos(termino,res)
            break
        case 'solicitud':
            buscarSolicitud(termino,res)
            break
        default:
            res.status(500).json({
                msg:'se me olvido hacer esta busqueda'
            })
    }

}