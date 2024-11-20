const express = require('express')
const admin = require('firebase-admin')

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json')

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    databaseURL: 'https://final-be-iot.firebaseio.com' //conseguirma la base de datos y colocar json de firebase en la raiz
});

const app = express();
app.use(express.json())

app.post('/insert', async (req, res) => {
    try {
        const newProyectos = req.body;

        if (!newProyectos.codigo) {
            return res.status(400).send('El campo codigo es obligatorio');
        }

        const proyectoRef = admin.firestore().collection('Proyectos').doc(newProyectos.codigo);
        const doc = await proyectoRef.get();

        if (doc.exists) {
            return res.status(400).send('el codigo ya existe en un proyecto');
        }

        await proyectoRef.set(newProyectos);
        res.status(200).json({ id: newProyectos.codigo });
    } catch (error) {
        res.status(500).send('error al agregar un proyecto: ' + error.message);
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
console.log(`servidor compilao en el puert ${PORT}, funcionando`)
})