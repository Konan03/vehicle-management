import { Vehicle } from "./Vehicle";

export interface User {
    uid: string;
    email: string;
    name: string;
    vehicles: Vehicle[]; // Aquí puedes definir el tipo Vehicle si deseas estructurarlo también
}