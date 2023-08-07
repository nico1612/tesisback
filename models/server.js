import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import {router} from '../routes/paciente.js';
import { dbConnection } from '../database/config.js';
import { routerAuth} from '../routes/auth.js'
import { routerMedico } from '../routes/medico.js';
import { routerBuscar } from '../routes/buscar.js';
import { routerSolicitud } from '../routes/solicitud.js';
import { routerRelacion } from '../routes/relecion.js';
import { routerUploads } from '../routes/uploads.js';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export class Server{

    constructor(){
        this.app = express()
        this.port=process.env.PORT
        this.server = createServer( this.app );
        this.io = new SocketIOServer(this.server);

        this.path={
            auth:      '/api/auth',
            buscar:    '/api/buscar',
            medico:    '/api/medico',
            relacion:  '/api/relacion',
            solicitud: '/api/solicitud',
            paciente:  '/api/pacientes',
            uploads:   '/api/uploads'
        }

        //middlewares
        this.middlewares()

        //conectar a la base de datos
        this.conectarDB()

        // Lectura y parseo del body
        this.app.use( express.json() );

        //rutas de mi apliacion
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use( this.path.auth,routerAuth);
        this.app.use( this.path.buscar,routerBuscar);
        this.app.use( this.path.solicitud,routerSolicitud);
        this.app.use( this.path.medico,routerMedico)
        this.app.use( this.path.paciente, router);
        this.app.use( this.path.relacion,routerRelacion)
        this.app.use( this.path.uploads, routerUploads)
;
    }

    listen(){
        this.server.listen(this.port,()=>{
            console.log('Servidor corriendo en el puerto ' , this.port)
        })
    }

}