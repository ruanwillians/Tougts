const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store') (session)
const flash = require('express-flash')

//set handlebars e express
const app = express()
const hbs = exphbs.create()

//import conn
const conn = require('./db/conn')

// import models
const Tougth = require('./models/Tougth')
const User = require('./models/User')

//import routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//import controller
const ToughtsController = require('./controllers/ToughtsController')
const { showToughts } = require('./controllers/ToughtsController')

//renderizar views com express e handlebars (template engine)
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

//estrtura de ler o body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//criando session midleware usando pacotes importados
app.use(
    session({
        name: 'session',
        secret: 'nossosecret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now()+ 360000),
            httpOnly: true
        }
}))

//usar flash mensagem
app.use(flash())

//set session to res (checkar se o usuario está logado pelo id)
app.use((req, res, next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

// public path estrutura de pastas
app.use('/static', express.static(__dirname + '/public'))

//routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

//exibir todos os pensmentos na barra
app.get('/', ToughtsController.showToughts)


conn
    // .sync({force:true})
    .sync()
    .then(()=>{
        app.listen(3000)
    }).catch((err) =>{
        console.log(err)
    })