import http from 'http';
import { parse } from 'url';

let users = [
	{ id: 49, username: 'maciek'},
];

const readBody = req => {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', chunk => body += chunk);
		req.on('end', () => {
			try { resolve(JSON.parse(body)); }
			catch (error) { reject(error); }
		});
	});
};

const server = http.createServer(async (req, res) => {
	const parsedUrl = parse(req.url, true);
	const pathSegments = parsedUrl.pathname
		.split('/')
		.filter((segment) => segment !== '');
	
	const objectId = parseInt(pathSegments[pathSegments.length - 1]);
	let statusCode = 404;
	let body = { error: 'Not found' };
	
	if (parsedUrl.pathname === '/users' && req.method === 'GET') {
		statusCode = 200;
		body = users;
	}
	
	if (parsedUrl.pathname === '/users' && req.method === 'POST') {
		const user = await readBody(req);
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
	
	res.writeHead(statusCode, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(body));
});

server.listen(3005, () => console.log(`Server running at http://localhost:3005/`));