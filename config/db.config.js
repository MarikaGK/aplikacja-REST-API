import { connect } from "mongoose";
import "dotenv/config";

const uriDb = process.env.DB_HOST;

const connection = async () => {
  if (!uriDb) {
    console.error("no db");
    process.exit(1);
  }

  await connect(uriDb, {
    dbName: "db-contacts",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connection;
