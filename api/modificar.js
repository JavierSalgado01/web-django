const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');

const servicio = require('./final-be-iot-firebase-adminsdk-wakra-b82f3b9014.json');

admin.initializeApp({
    credential: admin.credential.cert(servicio),
    storageBucket: 'gs://final-be-iot.firebasestorage.app',
    databaseURL: 'https://final-be-iot.firebaseio.com'
});

const app = express();
app.use(express.json());

const storage = multer.memoryStorage(); //guardado temporal
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const formato = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
        if (formato.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('formato no permitido'), false);
        }
    }
});

app.put("/update/:codigo", upload.single('file'), async (req, res) => {
    try {
        const { nombre, ubicacion, region, presupuesto, fecha_i, solicitante, estado, fecha_t, descripcion } = req.body;
        const { codigo } = req.params;

        const busca = await admin.firestore().collection('Proyectos').where('codigo', '==', codigo).get();
        if (busca.empty) {
            return res.status(404).send('No se encontró proyecto con ese código');
        }

        //Recupera url anterior de firebase y storage 
        const proyectoRef = busca.docs[0].ref;
        const bucket = admin.storage().bucket();

        const proyectoActual = await proyectoRef.get();
        
        //verifica si contiene el mismo url y lo compara 
        if (proyectoActual.exists && proyectoActual.data().docUrl) {
            const docUrlAnteriores = proyectoActual.data().docUrl;

            const urlsAEliminar = Array.isArray(docUrlAnteriores) //Al al tratar de sobreescribir el archvio anterior este se guardaba como arreglo, esto elimina el [arreglo]
                ? docUrlAnteriores  //verdadero
                : [docUrlAnteriores]; //falso 
                //con operadores tenarios "?" y ":" se asegura de reemplazar el if-else de una forma mucho mas compacta.

            //iteracion sobre las url a eliminar
            for (const docUrlAnterior of urlsAEliminar) {
                try {
                    const fileName = docUrlAnterior.split(`/${bucket.name}/`)[1]; //url de la imagen anterior 
                    
                    if (fileName) {
                        await bucket.file(fileName).delete(); //eliminacion del definitiva de la url
                    }
                } catch (err) { //atrapame esta 
                    console.log(`error al eliminar docUrl anterior: ${err.message}`);
                }
            }
        }

        //sube un nuevo archvio 
        let nuevoDocUrl = null; //let permite el cambio en la variable nuevoDocUrl y null es para dejar un valor no definido, este puede cambiar mas tarde 

        if (req.file) { //si se recibe la solicitud http del archvio (file)
            const nombreDoc = `proyectos/${codigo}/${req.file.originalname}`; //se declara la variable que contendra la url con el nombre de la imagen subida, de no recibirse quedaria como null
            const file = bucket.file(nombreDoc); //referencia la bucket de google storegae e interactua con el archivo 

            await file.save(req.file.buffer, { //almacena el contenido como buffer 
                metadata: { contentType: req.file.mimetype },//especifica el mime e identifica el tipo de archivo subido 
            });
            await file.makePublic(); //hace que la url generada sea de acceso publico 

            nuevoDocUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`; //url generada 
        }

        const datos = {nombre, ubicacion, region, presupuesto, fecha_i, solicitante, estado, fecha_t, descripcion}; 

        //Si no se llegase a subir ninguna imagen, este elimina el campo que contiene la url de la imagen
        if (nuevoDocUrl) { 
            datos.docUrl = nuevoDocUrl;
        } else if (nuevoDocUrl === null) {
            datos.docUrl = admin.firestore.FieldValue.delete();
        }

        //elimina campos que sean 'undefined', esto permite que si algun dato no sea rellenado o se omita no se guarde en la base de datos
        Object.keys(datos).forEach(key => {
            if (datos[key] === undefined) {
                delete datos[key];
            }
        });

        //fianlemte, se actualiza el documento 
        await proyectoRef.update(datos); 
        
        res.status(200).send('El documento se actualizó correctamente');
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).send('Error al actualizar en el servidor: ' + error.message);
    }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`servidor compilado en el puerto ${PORT}, funcionando`);
});