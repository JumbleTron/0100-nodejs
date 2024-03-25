import http from 'http';
import helmet from "helmet";
import passport from './new_auth';
import { availableParallelism } from 'node:os';
import cluster from "cluster";
import { readBody } from "./utils";


if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < availableParallelism(); i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const applyHelmetHeaders = helmet();
    const server = http.createServer((req, res) => {
        res.redirect = (url) => {
            res.writeHead(302, {
                location: url,
            });
            res.end();
        };
        applyHelmetHeaders(req, res, async () => {
            passport.authenticate('local')(req, res, async () => {
                const parsedUrl = parse(req.url, true);
                const pathSegments = parsedUrl.pathname
                    .split('/')
                    .filter((segment) => segment !== '');

                const objectId = parseInt(pathSegments[pathSegments.length - 1]);
                let statusCode = 404;
                let body = { error: 'Not found' };

                if (parsedUrl.pathname === '/login' && req.method === 'GET') {
                    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
                    fs.createReadStream('public/login.html').pipe(res);
                    return;
                }

                if (parsedUrl.pathname === '/login' && req.method === 'POST') {
                    passport.authenticate('local', {
                        successReturnToOrRedirect: '/users',
                        failureRedirect: 'login',
                        failureMessage: false,
                    }, () => {

                    })(req, res);
                }

                if (parsedUrl.pathname === '/users' && req.method === 'GET') {
                    statusCode = 200;
                    body = users;

                    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(body));
                }

                if (parsedUrl.pathname === '/slow' && req.method === 'GET') {
                    const worker = new Worker('./worker-thread.js')
                    worker.on('message', (message) => {
                        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(message));
                    })
                    return
                }

                if (parsedUrl.pathname === '/users' && req.method === 'POST') {
                    const userBody = await readBody(req);
                    const ajv = new Ajv({ allErrors: true })
                    addFormats(ajv)
                    const validate = ajv.compile(userSchema)
                    const valid = validate(userBody)

                    //@todo return formatted errors as below {
                    // 	"errors": [
                    // 		"field_name": [ valdiation_errors ]
                    //    ]
                    // }
                    if (!valid) {
                        statusCode = 422;
                        body = validate.errors
                    }
                    let lastId = 0;
                    users.map((user) => {
                        lastId = Math.max(lastId, user.id);
                    });
                    user.id = lastId + 1;
                    users.push(user);

                    statusCode = 201;
                    body = user;
                }

                if (req.method === 'GET' && !isNaN(objectId)) {
                    const user = users.find(u => u.id === objectId);
                    if (!user) {
                        statusCode = 404;
                        return;
                    }

                    statusCode = 200;
                    body = user;
                }

                if (req.method === 'GET' && /^\/avatars\/\w+\.png$/.test(parsedUrl.pathname)) {
                    res.writeHead(statusCode, { 'Content-Type': 'image/png' });
                    const parts = parsedUrl.pathname.split('/')
                    // @todo add not found for not existing files
                    fs.createReadStream('public/' + parts.pop()).pipe(res);
                    return;
                }

                if (req.method === 'GET' && /^\/assets\/(\w+\.\w+)/.test(parsedUrl.pathname)) {
                    // @todo return Content-Typ header based on file extension, public/assets dir contains sample files.
                    //const extension = path.extname('/example.csv');
                    res.writeHead(statusCode, { 'Content-Type': 'text' });
                    fs.createReadStream('public/assets/example.csv').pipe(res);
                    return;
                }

                //@todo add endpoint POST /rooms/{id}/book, and data validation for below data
                /**
                 * {
                 *   "user_id": required | guuid(https://pl.wikipedia.org/wiki/Globally_Unique_Identifier),
                 *   "check_in_date": required | date | format:"2024-04-15",
                 *   "check_out_date": required | date | format:"2024-04-15",
                 *   "check_in_time": optional | time | format:"5:20",
                 *   "phone_number": required | example: "+1234567890",
                 *   "room_type": required | allowed values: single, double, triple, king
                 *   "special_requests": optional | string | max length: 320
                 * }
                 */

                res.writeHead(statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(body));
            })
        })
    });


    console.log(`Worker ${process.pid} started`);
    server.listen(process.env.PORT ?? 3005, () => console.log(`Server running at http://localhost:3005/`));
}