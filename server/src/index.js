import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config();

const { NEO4J_SERVER, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

