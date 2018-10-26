const http = require('http'),
    fs = require('fs'),
    url = require('url'),
    {
        parse
    } = require('querystring');

mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};
http.createServer((req, res) => {
    //control code.
    var pathname = url.parse(req.url).pathname;

    if (pathname == "/") {
        pathname = "../index.html";
    }

    if (pathname == "../index.html") {
        fs.readFile(pathname, (err, data) => {

            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // En caso no haberse encontrado el archivo
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                }); return res.end("404 Not Found");
            }
            // Pagina encontrada
            // HTTP Status: 200 : OK

            res.writeHead(200, {
                'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
            });

            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());


            // Envia la respuesta 
            return res.end();
        });
    }


    if (req.method === 'POST' && pathname == "/cv")  {
        //peticion del formulario a traves del metodo POST
        collectRequestData(req, (err, result) => {
            if (err) {
                res.writeHead(400, {
                    'content-type': 'text/html'
                });
                return res.end('Bad Request');
            }
            fs.readFile("../templates/plantilla.html", function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {
                        'Content-Type': 'text/html'
                    });
                    return res.end("404 Not Found");
                }

                res.writeHead(200, {
                    'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
                });
                //Variables de control. 

                let parsedData = data.toString().replace('${dui}', result.dui)
                    .replace("${lastname}", result.lastname)
                    .replace("${firstname}", result.firstname)
                    .replace("${gender}", result.gender)
                    .replace("${civilStatus}", result.civilStatus)
                    .replace("${birth}", result.birth)
                    .replace("${exp}", result.exp)
                    .replace("${tel}", result.tel)
                    .replace("${std}", result.std);

                res.write(parsedData);
                return res.end();
            });
        });


    }
    if (pathname.split(".")[1] == "css") {
        //peticion de la hoja CSS
        fs.readFile(".." + pathname, (err, data) => {

            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                }); return res.end("404 Not Found");
            }

            res.writeHead(200, {
                'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/css'
            });

            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());


            // Envia la respuesta 
            return res.end();
        });
    }

    function collectRequestData(request, callback) {

        const FORM_URLENCODED = 'application/x-www-form-urlencoded';
        if (request.headers['content-type'] === FORM_URLENCODED) {
            let body = '';
            // Evento de acumulacion de data. 
            request.on('data', chunk => {
                body += chunk.toString();
            });
            // Data completamente recibida 
            request.on('end', () => {
                callback(null, parse(body));
            });
        } else {
            callback({
                msg: `The content-type don't is equals to ${FORM_URLENCODED}`
            });
        }
    
    }
    


}).listen(8081);

/*
1 - ¿Cuál es la principal función del módulo HTTP?

// Llamar el modulo.

2 - ¿Cuál es la principal función del módulo FileSystem?

// Permite al usuario controlar los archivos desde cualquier parte del código

3 - ¿Qué es un MIME type?

// Es un método para ordenar el documento y ayuda a ser ubicado más fácilmente.

4 - ¿Qué contienen las variables "req" y "res" en la creación del servidor?

// Los datos del post y su estado, respectivamente.

5 - ¿La instrucción .listen(number) puede fallar? Justifique.

// Si, ya que puede ser un puerto no valido o ya ocupado.

6 - ¿Por qué es útil la función "collectRequestData(...)"?

// Porque nos sirve para obtener el estado de la pagina y mostrarle al usuario solo lo necesario en caso de error.

7 - ¿Para qué, además de conocer la dirección de la petición, es útil la variable "pathname"?

// Para poder facilitar el redireccionamiento.

8 - ¿Qué contine el parametro "data"?

// Los datos sobre el estado de la petición.

9 - ¿Cuál es la diferencia entre brindar una respuesta HTML y brindar una CSS? 

// El primero necesita un Mimetype textHTML y el archivo CSS se lee como texto plano.

10 - ¿Qué contiene la variable "result"?

// Son todos los datos que se enviaron en el formulario.

11 - ¿Por qué con la variable "data" se debe aplicarse el metodo toString()? Justifique.

// Debido a que los datos se necesitan en string y  los datos no necesariamente son del tipo string.

12 - ¿Hay diferencia al quitar el control de peticiones para hojas CSS? Si sucedió algo distinto justifique por qué.

// Si, solo no se carga la hoja de estilos y se ve el html puro.

13 - ¿Se puede iniciar el servidor (node main.js) en cualquier sitio del proyecto? Cualquier respuesta justifique.

// No, al intentar iniciarlo da error.

14 - Con sus palabras, ¿Por qué es importante aprender Node.js sin el uso de frameworks a pesar que estos facilitan el manejo de API's?

// Para entender como funcionan las variables que utilizamos y lo  cual nos facilita el entendimiento de errores permitiéndonos entender los algoritmos de mejor manera.
*/