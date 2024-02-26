import http from 'http';
import passport from "passport";
import LocalStrategy from 'passport-local';
import fs from "fs";
import { parse } from "url";
import bodyParser from 'body-parser';

let users = [
	{ id: 49, username: 'maciek', password: 'haslo'},
];

passport.use('local', new LocalStrategy(
	function(username, password, done) {
		const user = users.find(user => user.username === username)
		if (!user) {
			return done(null, false);
		}
		
		if (user.password !== password) {
			return done(null, false);
		}
		
		return done(null, user);
	}
));

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username });
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

const server = http.createServer(async (req, res) => {
	res.redirect = (url) => {
		res.writeHead(302, {
			location: url,
		});
		res.end();
	}
	bodyParser.urlencoded({ extended: false })(req, res, () => {
			passport.authenticate('session')(req, res, () => {
				const parsedUrl = parse(req.url, true);
				if (parsedUrl.pathname === '/users' && req.method === 'GET') {
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify(users));
				} else if (parsedUrl.pathname === '/login' && req.method === 'GET') {
					res.writeHead(200, {'Content-Type': 'text/html'});
					fs.createReadStream('public/login.html').pipe(res);
				} else if (parsedUrl.pathname === '/login' && req.method === 'POST') {
					passport.authenticate('local', {
						successReturnToOrRedirect: '/users',
						failureRedirect: '/login',
						failureMessage: false,
					})(req, res, () => {
						res.redirect('/users')
					});
				} else {
					res.writeHead(404, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({'error': 'Not found'}));
				}
			});
	});
});

server.listen(process.env.PORT ?? 3005, () => console.log(`Server running at http://localhost:3005/`));