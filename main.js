import http from 'http';

const users = [
	{ id: 49, username: 'maciek', email: 'mackiek@mail.com' }
];

const readBody = (req, callback) => {
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});
	req.on('end', () => {
		try {
			const data = JSON.parse(body);
			callback(data, null);
		} catch (error) {
			callback(null, error);
		}
	});
};

const server = http.createServer((req, res) => {
	let message = { error: 'Not found' };
	let statusCode = 404;
	if (req.url === '/users' && req.method === 'GET') {
		statusCode = 200;
		res.writeHead(200, { 'Content-Type': 'application/json' });
		console.log(users)
		res.end(JSON.stringify(users));
		return;
	}
	if (req.url === '/users' && req.method === 'POST') {
		readBody(req, (data, error) => {
			if (error !== null) {
				message = { error: 'Bad request' }
				res.writeHead(400, { 'Content-Type': 'application/json' });
				console.log(message)
				res.end(JSON.stringify(message));
			} else {
				const { username, email } = data;
				const user = {
					id: Math.floor(Math.random() * 100),
					username,
					email
				}
				users.push(user)
				res.writeHead(201, { 'Content-Type': 'application/json' });
				console.log(user)
				res.end(JSON.stringify(user));
				return;
			}
		})
	}
	/*res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plan');
	const message = `Node application pid: ${process.pid}, db_host is ${process.env.DB_HOST}`
	console.log(message);*/
});

server.listen(3005, () => {
	console.log(`Server running at http://localhost:${3005}/`);
});
//node -r dotenv/config