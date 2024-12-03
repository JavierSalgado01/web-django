//firebase-admin  
//express 
//multer

const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json');
const { resolve } = require('path');

const storage = multer.memoryStorage();
const upload = multer({storage, 
    fileFilter : (req, file, cb) => {
        const formato = ['image/png', 'image/jpg', 'image/jpeg','application/pdf']; 
        if (formato.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('formato no permitido'), false);
        }
    }});

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    storageBucket: 'gs://final-be-iot.firebasestorage.app',
    databaseURL: 'https://final-be-iot.firebaseio.com' //conseguirma la base de datos y colocar json de firebase en la raiz
});

const app = express();
app.use(express.json())

app.post('/insert', upload.single('file'), async (req, res) => {
    console.log('archivo recibido:', req.file);
    console.log('el body de la solicitud:', req.body);
    try {
        const newProyectos = req.body;

        if (!newProyectos.codigo) {
            return res.status(400).send('El campo codigo es obligatorio');
        }

        const proyectoRef = admin.firestore().collection('Proyectos').doc(newProyectos.codigo);
        const doc = await proyectoRef.get();

        if (doc.exists) {
            return res.status(400).send('El ccdigo ya existe en un proyecto');
        }

        // Para subir archivo imagen/doc
        if (req.file) {
            const bucket = admin.storage().bucket(); 
            const nombre = `proyectos/${newProyectos.codigo}/${req.file.originalname}`;
            const file = bucket.file(nombre);

            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            await file.makePublic();

            const docUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
            newProyectos.docUrl = docUrl; 
        }

        await proyectoRef.set(newProyectos);
        res.status(200).json({
            id: newProyectos.codigo,
            archivoUrl: newProyectos.docUrl || null,
        });
    } catch (error) {
        res.status(500).send('Error al agregar un proyecto: ' + error.message);
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
console.log(`servidor compilao en el puert ${PORT}, funcionando`)
})