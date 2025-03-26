import { DataSource } from "typeorm";
import Consumible from '../entities/Consumible';
import { DATABASE } from "../utils/Config";

const AppDataSource = new DataSource({
    type: "sqlite",
    database: DATABASE,
    entities: [Consumible],
    synchronize: true,
    logging: false
});

export const initializeConnection = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Conexion a Wendy's iniciada");
    } catch (error) {
        console.error("Error al conectar la DB", error);
    }
}

export default AppDataSource;