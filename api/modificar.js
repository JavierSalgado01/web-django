const express = require('express');
const admin = require('firebase-admin');

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json');

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    databaseURL: 'https://final-be-iot.firebaseio.com' 
});

const app = express();
app.use(express.json());

app.put("/update/:codigo", async (req, res) => {
    try {
        const { nombre, ubicacion, region, presupuesto, fecha_i, solicitante, estado, fecha_t } = req.body;
        const { codigo } = req.params;
        const busca = await admin.firestore().collection('Proyectos').where('codigo', '==', codigo).get();
        if (busca.empty) {
            return res.status(404).send('no se encontro  proyecto con ese código'); 
        }
        const proyectoRef = busca.docs[0].ref;
        await proyectoRef.update({
            nombre, ubicacion, region, presupuesto, fecha_i, solicitante, estado, fecha_t});
        res.status(200).send('el documento se actualizo correctamente');
    } catch (error) {
        res.status(500).send('Error al actualizar en el servidor: ' + error.message);
    }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`servidor compilado en el puerto ${PORT}, funcionando`);
});