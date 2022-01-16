const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/myURLShortener")
const { UrlModel } = require('./models/urlshort')

app.get(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    let allURL = UrlModel.find((err, result) => {
        res.render("home", {
            urlResult: result
        })
    })
})

app.post('/create', (req, res) => {
    //Create the short URL
    let urlShort = new UrlModel({
        longUrl: req.body.fullUrl,
        shortUrl: generateUrl()
        //Store in DB
    })

    urlShort.save((err, data) => {
        if (err) throw err;
        res.redirect("/")
    })
});

app.get('/:urlId', (req, res) => {
    UrlModel.findOne({ shortUrl: req.params.urlId }, (err, data) => {
        if (err) throw err;
        UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } }, (err, updatedData) => {
            if (err) throw err;
            res.redirect(data.longUrl)

        })
    })
})

app.get("/delete/:id", (req, res) => {
    UrlModel.findByIdAndDelete({ _id: req.params.id }, (err, deleteData) => {
        if (err) throw err;
        res.redirect('/')
    })
})
app.listen(process.env.PORT || 5000);

function generateUrl() {
    var randomResult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < 5; i++) {
        randomResult += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return randomResult
}