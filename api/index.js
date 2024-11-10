//dependencias: node, requests, firebase-admin, express
//Instalar extension ThunderClient http://127.0.01/ - http://localhost:3000/
//instalar nodejs en la pagina de node
const express = require('express')
const admin = require('firebase-admin')

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-51b5387d94.json')

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    databaseURL: 'https://final-be-iot.firebaseio.com' //conseguirma la base de datos y colocar json de firebase en la raiz
});

const app = express();
app.use(express.json())

app.get('/', async(req, res) =>{
    try{
        const datos = await admin.firestore().collection('Proyectos').get()
        const proyecto = []  
            datos.forEach(doc => {
                proyecto.push({id: doc.id, ...doc.data()});
        });
        res.status(200).json(proyecto)
        console.log(proyecto)
    }catch(error){
        res.status(500).send('error al obtener datos del servidor' + error.message);
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`servidor compilado en el puerto ${PORT}, funcionando`)
})