import { response } from "express";
import { v2 } from "cloudinary";
import { Consulta } from "../models/consulta.js";
import * as tf from "@tensorflow/tfjs-node";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.resolve(__dirname, '../modelosIA/DermatitisAtopica/model.json');
const cloudinary = v2;
class L2 {

  static className = 'L2';

  constructor(config) {
     return tf.regularizers.l1l2(config)
  }
}
tf.serialization.registerClass(L2);

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
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.files) {
    res.status(400).json({ msg: "No files were uploaded." });
    return;
  }

  const { tempFilePath } = req.files.files;
  try {

    // 2. Cargar el modelo
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    // 3. Preparar la imagen para hacer una predicción
    const imgBuffer = fs.readFileSync(tempFilePath); // Lee la imagen
    const decodedImg = tf.node.decodeImage(imgBuffer); // Decodifica la imagen
    const resizedImg = decodedImg.resizeBilinear([256, 256]).expandDims(0); // A
    // 4. Hacer una predicción con el modelo
    const prediction = model.predict(resizedImg);
    const tensorValue = await prediction.data(); // Obtener el valor numérico del tensor
    const resultadoDA = tensorValue[0].toFixed(2);
    console.log("Resultado de predicción:", resultadoDA);

    const { secure_url } = await callCloudinary().uploader.upload(tempFilePath, {
      folder: `consultas/${id}`,
    });

    const img = secure_url;
    const consulta = new Consulta({
      usuario,
      resultadoDA,
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