const {MongoClient} = require("mongodb");
const data = require('./data.json');
require('dotenv').config();

async function main() {
    
    const URI = process.env.DATABASE_URI;
    const client = new MongoClient(URI,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        console.log("connected to database ...");
        let productsCollection = await client.db('inventory').collection('products');
        const result = await productsCollection.insertMany(data);
        console.log('flooded the collection with json data of count' + result.insertedCount);  
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await client.close();
        console.log("Database disconnected successfully");
    }
}

main();
