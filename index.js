const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
require('dotenv').config();
const conectarDB = require("./DataBase/index");

//Creamos los Routes
const UserRoutes = require("./routers/user");
const AnimalRoutes = require("./routers/animal");

//conectar a la base
conectarDB()
const app = express();

//Parseamos los datos y Cors
app.use(bodyParser.urlencoded( {extended:true} ));
app.use(bodyParser.json());
app.use(cors());


//Mis rutas
app.use('/api/users', UserRoutes);
app.use('/api/animals', AnimalRoutes);

const port = 4000
app.listen(port , () =>{
    console.log(`server listen in ${port}`);
})