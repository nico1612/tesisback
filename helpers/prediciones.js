import * as tf from "@tensorflow/tfjs-node";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.resolve(__dirname, '../modelosIA/DermatitisAtopica/model.json');

class L2 {
    static className = 'L2';
  
    constructor(config) {
       return tf.regularizers.l1l2(config);
    }
}

tf.serialization.registerClass(L2);

export const DermatitisAtopicaPrediccion = async ({ tempFilePath }) => {
    try {
        // 2. Cargar el modelo
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        // 3. Preparar la imagen para hacer una predicción
        const imgBuffer = fs.readFileSync(tempFilePath);
        const decodedImg = tf.node.decodeImage(imgBuffer);
        const resizedImg = decodedImg.resizeBilinear([256, 256]).expandDims(0);
        // 4. Hacer una predicción con el modelo
        const prediction = model.predict(resizedImg);
        const tensorValue = await prediction.data();
        const resultadoDA = parseFloat(tensorValue[0].toFixed(2));

        console.log("Resultado de predicción:", resultadoDA);

        return { resultadoDA }; // Devolver un objeto JSON con el resultado
    } catch (error) {
        console.error("Error al realizar la predicción:", error);
        return { error: "Error al realizar la predicción" };
    }
};
