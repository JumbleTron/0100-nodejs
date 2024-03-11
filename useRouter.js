import { loginGet, loginPost } from "./routes/login.js";
import { usersGet, usersPost } from "./routes/users.js";

const routes = {
    '/login': {
        'GET': loginGet,
        'POST': loginPost,
    },
    '/users': {
        'GET': usersGet,
        'POST': usersPost,
    }
};

export async function useRouter(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    const handler = routes[path]?.[method] || notFound;
    handler(req, res);
}

function notFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
}

