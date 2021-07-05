const express = require("express");
const {MongoClient} = require("mongodb");
require('dotenv').config();

const app = express();


const client = new MongoClient(process.env.DATABASE_URI,{useNewUrlParser: true, useUnifiedTopology: true});
client.connect().then((log, err)=> {
    if(err) return console.log(err);
    console.log("connected to Database....");
});   



app.use(express.static("./public"))

app.set("view engine", "ejs");


const DEFAULT_PRICE = 1000;
const DEFAULT_RATING = 0;
const PORT = process.env.PORT || 3000;


async function getProducts(items=-2) {
    let returnList = [];
    if(items == -2) {
        const cursor = client.db('inventory').collection('products').find({rating: { $gte: 0 }});
        const productList = await cursor.toArray();     
        productList.forEach((data, i) => returnList.push(data));
        return returnList;
    }
}

async function getFilteredProducts(maxprice, minrating) {    
    let returnList = [];
    const cursor = client.db('inventory').collection('products').find(
        {
            price: { $lte: maxprice},
            rating: { $gte: minrating}
        }
    );
    const List = await cursor.toArray();
    List.forEach((data) => returnList.push(data));
    return returnList;
}

app.get('/', (req, res) => {
    getProducts().then(productList => res.render('index', {productList}));
});


app.get('/filter', (req, res) => {
    if(!req.query.price && !req.query.rating) return res.redirect("/");
    const maxPrice = req.query.price == ''? DEFAULT_PRICE:Number(req.query.price);    
    const minRating = req.query.rating == ''? DEFAULT_RATING:Number(req.query.rating);
    getFilteredProducts(maxPrice, minRating).then(productList => res.render('index',{productList}));
})


app.listen(PORT, () => {
    console.log("Server is up and running.....");
});
