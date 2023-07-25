import { Router } from "express";
import { buscar } from "../controller/buscar";

export const routerBuscar=Router()

routerBuscar.get('/:coleccion/:termino',buscar)