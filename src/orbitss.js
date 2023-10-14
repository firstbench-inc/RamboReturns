import IPFS from "ipfs-core";
import OrbitDB from "orbit-db";

const initIPFSNode = async () => {
  return IPFS.create();
};

const main = async () => {
  const ipfs = await initIPFSNode();
  const orbitdb = await OrbitDB.createInstance(ipfs);

  try {
    const dbName = "my-database";
    const db = await orbitdb.open(dbName, {
      create: true,
      overwrite: false,
    });

    await db.load();

    // Push (Insert) Data into the Database
    const dataToPush = { _id: "1", text: "Hello, OrbitDB!" };
    await db.put(dataToPush);

    // Get (Retrieve) Data from the Database
    const keyToRetrieve = "1";
    const retrievedData = db.get(keyToRetrieve);

    console.log("Data pushed into the database:", dataToPush);
    console.log("Data retrieved from the database:", retrievedData);

    // Close the database and IPFS node when done
    await db.close();
    await ipfs.stop();
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
