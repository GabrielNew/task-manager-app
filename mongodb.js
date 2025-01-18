import mongodb from "mongodb";

const { DB_URL, DB_NAME } = process.env;

const url = DB_URL;
const client = new mongodb.MongoClient(url);
const dbName = DB_NAME;

async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
