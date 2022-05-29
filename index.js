import express, { json } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from "body-parser"
const app = express();

const products = new Map();
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/products", (req, res) => {
    let text = "";
    products.forEach((value, key) => {
        text += JSON.stringify(value) + "\n";
    })
    res.send(text);
});

app.get("/products/:getid", (req, res) => {
    const { getid } = req.params;
    const product = products.get(getid)
    res.send(JSON.stringify(product))
});

app.post("/products", (req, res) => {
    const { name, price } = req.body;
    const id = uuidv4()
    const product = {
        "name": name,
        "price": price,
        "cdate": new Date(),
        "udate": null,
        "id": id,
        reviews: []
    }
    products.set(id, product)
    res.send(`product id is ${id}`)
})

app.put("/products/:updateid", (req, res) => {
    const { updateid } = req.params;
    const { name, price } = req.body;
    const product = products.get(updateid)

    if (name != undefined)
        product.name = name
    if (price != undefined)
        product.price = price
    product.udate = new Date()
    products.set(updateid, product)
    res.send(JSON.stringify(product))
})

app.delete("/products/:delid", (req, res) => {
    const { delid } = req.params
    const product = products.get(delid)
    products.delete(delid)
    res.send("deleted " + JSON.stringify(product))
})

app.post("/products/:pid/reviews", (req, res) => {
    const { userId, description } = req.body;
    const pid = req.params.pid
    const reviewId = uuidv4()
    const review = {
        "userId": userId,
        "description": description,
        "cdate": new Date(),
        "udate": null,
        "reviewID": reviewId
    }
    const product = products.get(pid)
    product.reviews.push(review)
    products.set(pid, product)
    res.send(`review id is ${reviewId}`)
})

app.delete("/products/:delpid/reviews/:delrid", (req, res) => {
    const { delpid, delrid } = req.params
    const product = products.get(delpid)
    var idx = -1
    product.reviews.forEach((element, index) => {
        if (element.reviewID == delrid)
            idx = index
    })
    if (idx != -1)
        product.reviews.splice(idx, 1)
    products.set(delpid, product)
    res.send("deleted review")
})

app.listen(3000, () => {
    console.log("server is listening");
});