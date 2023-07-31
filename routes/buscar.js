import { Router } from "express";
import { buscar } from "../controller/buscar.js";

export const routerBuscar=Router()

routerBuscar.get('/:coleccion/:termino',buscar)