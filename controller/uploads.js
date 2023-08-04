import { response } from "express";
import { v2 } from "cloudinary";
import { Consulta } from "../models/consulta.js";

const cloudinary = v2;
const callCloudinary=()=>{
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
  })
  return cloudinary
}
 

export const actualizarImagenCloudinary = async (req, res = response) => {
  const { id } = req.body;
  const usuario = id;
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1 para obtener el número de mes correcto.
  const ano = fechaActual.getFullYear();
  const resultado = "ninguno de los tres";

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.files) {
    res.status(400).json({ msg: "No files were uploaded." });
    return;
  }

  const { tempFilePath } = req.files.files;

  try {

    const { secure_url } = await callCloudinary().uploader.upload(tempFilePath, {
      folder: `consultas/${id}`,
    });

    const img = secure_url;
    const consulta = new Consulta({
      usuario,
      resultado,
      dia,
      mes,
      ano,
      img,
    });
    await consulta.save();

    res.json(consulta);
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};