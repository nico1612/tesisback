import { response } from "express";
import mongoose from "mongoose";
import { Usuario } from "../models/usuario.js";
import { Medico } from "../models/medico.js";
import { Solicitud } from "../models/solicitud.js";
import { Consulta } from "../models/consulta.js";
const ObjectId = mongoose.Types.ObjectId

const coleccionesPermitidas=[
    'usuarios',
    'medicos',
    'solicitud',
    'consultas'
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
    let medicos=[]
    let usuarios=[]
   
    const regex = new RegExp( termino, 'i' );
    const solicitudes = await Solicitud.find({
        $or: [ { receptor: regex }],
        $and: [{ estado: true }]
    })

    const promiseArray = solicitudes.map(async (solicitud) => {
        const medico = await Medico.findById(solicitud.emisor);
        if (medico) {
             medicos.push(medico);
        }
    });
        
    // Esperar a que todas las promesas se resuelvan antes de continuar
    await Promise.all(promiseArray);
    if(promiseArray){
        return res.json({
            results: medicos
        });
    }
    else{
        const promiseArray = solicitudes.map(async (solicitud) => {
            const usuario = await Usuario.findById(solicitud.emisor);
            if (usuario) {
                usuarios.push(usuario);
            }
        });
        await Promise.all(promiseArray);
   
        return res.json({
            results: medicos
        });
    }

}

const buscarConsulta = async(termino='',res=response)=>{

    const regex = new RegExp( termino, 'i' );
    const consultas = await Consulta.find({
        $or: [ { usuario: regex }],
    })

    return res.json({
        results: consultas
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
        case 'consultas':
            buscarConsulta(termino,res)
            break
        default:
            res.status(500).json({
                msg:'se me olvido hacer esta busqueda'
            })
    }

}