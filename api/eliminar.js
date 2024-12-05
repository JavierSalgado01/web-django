const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');

const storage = multer.memoryStorage();

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json');

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    storageBucket: 'gs://final-be-iot.firebasestorage.app',
    databaseURL: 'https://final-be-iot.firebaseio.com' 
});

const app = express();
app.use(express.json());

app.delete('/delete/:id', async (req, res) => {
    try {
        const doc_id = req.params.id; 
        const doc_ref = admin.firestore().collection('Proyectos').doc(doc_id);

        const obtener = await doc_ref.get();
        const bucket = admin.storage().bucket(); 

        const proyectoDatos = obtener.data();

        if (proyectoDatos.docUrl) {
            const eliminarUrl = Array.isArray(proyectoDatos.docUrl)
            ? proyectoDatos.docUrl
            : [proyectoDatos.docUrl];
        
    for (const docUrl of eliminarUrl) {
        try {
            const fileName = docUrl.split(`/${bucket.name}/`)[1];
            if (fileName) {
                console.log(`eliminado imagen del bucket: ${fileName}`);
                await bucket.file(fileName).delete();
            }
        } catch (err) {
            console.error(`error al eliminar archivo del bucket: ${err.message}`);
    }}};

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
