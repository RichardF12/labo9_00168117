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


}).listen(8081);

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

/*
1- llamar el modulo.
2- Permite al usuario controlar los archivos desde cualquier parte del codigo
3- Es un metodo para ordenar el documento y ayuda a ser ubicado más facilmente.
4- Los datos del post y su estado, respectivamente.
5- Si, ya que puede ser un puerto no valido o ya ocupado.
6- para obtener el estado de la pagina y mostrarle al usuario solo lo necesario en caso de error.
7- Para poder redireccionar a la pagina principal.
8- Los datos sobre el estado de la petición.
9- No veo la diferencia
10- El resultado a imprimise
11- Debido a que los datos que se requieren necesitan ser string, y los datos dentro del data no necesariamente son string
*/