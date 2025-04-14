
import { MongoClient,ServerApiVersion } from "mongodb";
import { mongodb_uri } from "../../constants.ts";

const client = new MongoClient(mongodb_uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function db_connect() {
  try {
    const conn = await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return conn;
  }
  catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
  finally {
    await client.close(); 
  }
}

export { db_connect };
