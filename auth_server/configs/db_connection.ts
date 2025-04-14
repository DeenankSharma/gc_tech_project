
import { MongoClient,ServerApiVersion } from "mongodb";
import { mongodb_uri } from "../constants.ts";

const db_client = new MongoClient(mongodb_uri!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function db_connect() {
  try {
    const conn = await db_client.connect();
    return conn;
  }
  catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

export { db_connect };
