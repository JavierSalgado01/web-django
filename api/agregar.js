//firebase-admin  
//express 
//multer
//no usar _ para separar, solo mayusculas
const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json');

//multer: middleware que procesa solicitudes tipo: multipart/form-data
//storage: servicio de firebase que guarda documentos e imagenes 
//bucket: carpeta en la que se guardan los proyectos de storage 
//mimetype: estantar que define que tipo de archivos para que se puedan interpretar correctamente
//cb: callback, operador booleano

const storage = multer.memoryStorage(); //memoria temporal
const upload = multer({storage, 
    fileFilter : (req, file, cb) => {
        const formato = ['image/png', 'image/jpg', 'image/jpeg','application/pdf']; //definicion de los formatos aceptados 
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
            const nombre = `proyectos/${newProyectos.codigo}/${req.file.originalname}`; //se genera la url con el codigo del proyecto y el nombre del archivo
            const file = bucket.file(nombre); //se crea el bucket como tal 

            //Guardar imagen
            await file.save(req.file.buffer, {
                metadata: { //especificacion del tipo de archivo
                    contentType: req.file.mimetype, //tipo de archivo (mimetype lo identifica, jpg, gif, etc)
                },
            });

            await file.makePublic(); //Para que sea visible la imagen, esta se debe hacer publica 

            const docUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`; //enlace se guarda en la variable url
            newProyectos.docUrl = docUrl; //la imagen se guarda junto al proyecto creado en el mismo formulario
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