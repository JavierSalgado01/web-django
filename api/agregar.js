const express = require('express')
const admin = require('firebase-admin')

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json')

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    databaseURL: 'https://final-be-iot.firebaseio.com' //conseguirma la base de datos y colocar json de firebase en la raiz
});

const app = express();
app.use(express.json())

app.post('/insert', async(req, res) =>{
    try{
        
        const newProyectos = req.body;
        const ref = await admin.firestore().collection('Proyectos').add(newProyectos);
        res.status(201).json({id: ref.id});       
    }catch(error){
        res.status(500).send('Error al agregar un proyecto: ' + error.message);
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
console.log(`servidor compilao en el puert ${PORT}, funcionando`)
})