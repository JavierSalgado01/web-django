const express = require('express');
const admin = require('firebase-admin');

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-51b5387d94.json');

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    databaseURL: 'https://final-be-iot.firebaseio.com' 
});

const app = express();
app.use(express.json());

app.delete('/delete/:id', async (req, res) => {
    try {
        const doc_id = req.params.id; 
        const doc_ref = admin.firestore().collection('Proyectos').doc(doc_id); 
        await doc_ref.delete(); 
        return res.status(200).send('eliminado el proyecto id: ' + doc_id);
    } catch (error) {
        res.status(500).send('Error al obtener datos del servidor: ' + error.message);
    }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`servidor compilao en el puert ${PORT}, funcionando`);
});
