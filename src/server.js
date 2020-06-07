const express = require("express") //usando o express para iniciar um servidor
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta pública
server.use(express.static("public"))

//habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos (rotas) da aplicação
//verbos HTTP - GET - POST entre outros
//página inicial
//req: requisição, res: resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    //req.query: Query String da nossa url
    //console.log(req.query)
    return res.render("create-point.html")
    
})
server.post("/savepoint", (req, res) => {
    //req.body: corpo do formulário
    // console.log(req.body)
    //inserir dados no BD
    const query = `
        INSERT INTO places (
            name,
            image,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.name,
        req.body.image,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items

    ]
    function afterInsertData(err) {
        if (err) { 
            console.log(err) 
            return res.send("Erro no cadastro!")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)
        return res.render("create-point.html", { saved: true })
    }
    db.run(query, values, afterInsertData)

})

server.get("/search-result", (req, res) => {

    const search = req.query.search
    if(search == ""){
        return res.render("search-result.html", { total: 0 })
    }
    //pegar dados do BD
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) { return console.log(err) }
        const total = rows.length
        //mostar a página html com os dados do DB
        return res.render("search-result.html", { places: rows, total: total })
    })
})

//ligar o servidor
server.listen(8080)