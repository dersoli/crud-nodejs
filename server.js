const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://dersoli:0tzh66Oaxa6Brf1F@mongo-dersoli-first-crud-n7vhm.mongodb.net/test?retryWrites=true&w=majority"
const ObjectId = require('mongodb').ObjectID

MongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err)
    db = client.db('mongo-dersoli-first-crud')
    app.listen(9000, () => {
        console.log("Servidor rodando na porta 9000")
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req,res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if(err) return console.log(err)
        res.render('show.ejs', {data: results})
    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if(err) console.log(err)

        console.log('Salvo no banco de dados')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {data: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    
    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log("Atualizado no Banco de Dados")
    })
})

app.route('/delete/:id')
.get((req, res) => {
    var id= req.params.id

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log("Deletado do Banco de Dados")
        res.redirect('/show')
    })
})