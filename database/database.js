import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do .env

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false, // Oculta logs SQL (opcional)
  }
);

export default connection;
