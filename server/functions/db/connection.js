import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://amborn02:o9a2zuk9H4dGK556@cluster1.gw0b0jk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
const client = await MongoClient.connect(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("aquariums");

export default db;