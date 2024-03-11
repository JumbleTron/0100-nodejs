import { parse } from 'url';
import { loginGet, loginPost } from "./routes/login.js";
import { usersGet, usersGetId, usersPost } from "./routes/users.js";
import { Worker } from 'worker_threads'
import * as fs from "fs";

export default async function useRouter(req, res) {
    const parsedUrl = parse(req.url, true);
    const pathSegments = parsedUrl.pathname
        .split('/')
        .filter((segment) => segment !== '');

    const lastPathElement = pathSegments.pop();
    const objectId = parseInt(lastPathElement);
    const method = req.method;

    if (parsedUrl.pathname === '/login') {
        if (method === 'POST') {
            loginPost(req, res);
            return;
        }
        loginGet(req, res);
        return;
    }

    if (parsedUrl.pathname === '/users') {
        if (method === 'POST') {
            usersPost(req, res)
            return;
        }

        usersGet(req, res);
        return;
    }

    if (/^\/users\/\d+$/.test(parsedUrl.pathname) && method === 'GET') {
        usersGetId(req, res, objectId)
        return;
    }

    if (parsedUrl.pathname === '/slow' && req.method === 'GET') {
        const worker = new Worker('./worker-thread.js')
        worker.on('message', (message) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
        })
        return
    }

    if (req.method === 'GET' && /^\/avatars\/\w+\.png$/.test(parsedUrl.pathname)) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        const parts = parsedUrl.pathname.split('/')
        fs.createReadStream('public/' + parts.pop()).pipe(res);
        return;
    }

    if (req.method === 'GET' && /^\/assets\/(\w+\.\w+)/.test(parsedUrl.pathname)) {
        res.writeHead(200, { 'Content-Type': 'text' });
        fs.createReadStream('public/assets/example.csv').pipe(res);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
}