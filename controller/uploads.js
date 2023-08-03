import { response } from "express";
import path from 'path';
import fs from 'fs'
import cloudinary from 'cloudinary'
import { subirArchivo } from "../helpers/subirArchivos.js";
import { Usuario } from "../models/usuario.js";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cargarArchivo = async(req, res = response) => {

    try {
        
        // txt, md
        // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );
        res.json({ nombre });

    } catch (msg) {
        res.status(400).json({ msg });
    }

}


export const actualizarImagenCloudinary=async(req,res=response)=>{

  const {id}=req.params

  let modelo=await Usuario.findById(id)
  if(!modelo){
    return res.status(400).json({
        msg:`No existe un usuario con el id ${id}`
    })
   }

  if(!modelo.img){
    /*const nombreArr = modelo.img.split('/');
    const nombre    = nombreArr[ nombreArr.length - 1 ];
    const [ public_id ] = nombre.split('.');
    cloudinary.v2.uploader.destroy( public_id );*/
  }

  const cloud_name= process.env.CLOUDINARY_CLOUD_NAME
  const API_KEY =process.env.CLOUDINARY_API_KEY
  const API_SECRET= process.env.CLOUDINARY_API_SECRET
    console.log({cloud_name, API_KEY, API_SECRET})
  const {tempFilePath} = req.files.archivo
  //console.log(tempFilePath)
  const resp = await cloudinary.v2.uploader.upload( tempFilePath );
  /*modelo.img = secure_url;*/

  //await modelo.save();

  res.json( resp );

}

export const mostrarImagen=async(req,res=response)=>{
  const {id,coleccion}=req.params

  let modelo

  switch(coleccion){
    case 'usuario':
      modelo=await Usuario.findById(id)
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        })
      }
    break;

    case 'productos':
      modelo=await Producto.findById(id)
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        })
      }

    break;

    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto'});
  }

  if(!modelo.img){
    const pathImagen=path.join(__dirname,'../uploads',coleccion,modelo.img)
    if(fs.existsSync(pathImagen)){
      return res.sendFile(pathImagen)
    }
  }

  const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
  res.sendFile( pathImagen );
}