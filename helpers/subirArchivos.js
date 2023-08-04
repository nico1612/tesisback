import path from 'path';
import { v4 as uuidv4 } from 'uuid';
uuidv4()
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 
export const subirArchivo = ( file, extencionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise((resolve,reject)=>{
        const {files} = file;
        const nombreCortado = files.name.split(".")
        const extencion =nombreCortado[nombreCortado.length-1]
    
    
        if(!extencionesValidas.includes(extencion)){
            return reject("extencion no valida")
        }
        const nombreTemp=uuidv4()+"."+extencion
        const uploadPath = path.join( __dirname, '../uploads/', carpeta ,nombreTemp)
     
        files.mv(uploadPath, (err)=> {
            
            if (err) {
                reject(err)
        }
            resolve({uploadPath, nombreTemp})
        });
    })
    


}
