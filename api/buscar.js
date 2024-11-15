const express = require('express');
const admin = require('firebase-admin');

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json');

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    databaseURL: 'https://final-be-iot.firebaseio.com' 
});

const app = express();
app.use(express.json());

app.get('/search/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const proyectoRef = admin.firestore().collection('Proyectos').doc(id);
        const proyectos = await proyectoRef.get();
        if (!proyectos.exists) {
            return res.status(404).send('Proyecto no encontrado');
        }
        const proyecto = { id: proyectos.id, ...proyectos.data() };
        res.status(200).json(proyecto);
        console.log(proyecto);
    } catch (error) {
        res.status(500).send('error al obtener datos del servidor: ' + error.message);
    }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`servidor compilao en el puert ${PORT}, funcionando`);
});
