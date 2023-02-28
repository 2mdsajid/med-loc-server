let express =  require('express')
const mongoose  = require("mongoose")

const dotenv = require('dotenv') //for .env file
dotenv.config({ path: './config.env' })

let app = express()

// CONNECTING TO MONGO DB
require('./db/conn')

app.use('/public', express.static('public'));
app.use(
    express.urlencoded({ extended: true })
);

let cors = require('cors')
app.use(cors());
//before AUTH.JS loading so that it effects
app.use(express.json()) 

// file upload

// bodyParser = require('body-parser');

// app.use(bodyParser.json({ limit: '50mb' }))
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// app.use(express.json())


// console.log('undefined')


const PORT = process.env.PORT || 5000 
//5000 for local system & other for server

// get all from AUTH.JS linking router
app.use(require('./router/auth'))
app.use(require('./router/userauth'))
app.use(require('./router/testauth'))


// 3 step
if(process.env.NODE_ENV == "production" ){
    app.use(express.static("client/my-app/build"))
}


app.listen(PORT,()=>{
    console.log(`server runnig at port ${PORT}`);
})

