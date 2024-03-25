import http from 'http';
import helmet from "helmet";
import passport from './utils/auth.js';
import { useRouter } from './useRouter.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import MemoryStore from 'express-session/session/memory.js';
import cookieParser from 'cookie-parser';

const applyHelmetHeaders = helmet();

const sessionOptions = {
	secret: 'keyboard cat',
	resave: false,
	store: new MemoryStore(),
	saveUninitialized: false,
	cookie: { secure: false },
};

const server = http.createServer(async (req, res) => {
	res.redirect = (url) => {
		res.writeHead(302, {
			location: url,
		});
		res.end();
	};
	applyHelmetHeaders(req, res, () => {
		bodyParser.urlencoded({ extended: false })(req, res, () => {
			cookieParser()(req, res, () => {
				session(sessionOptions)(req, res, () => {
					passport.authenticate('session')(req, res, () => {
						useRouter(req, res);
					});
				});
			});
		});
	});
});

server.listen(process.env.PORT ?? 3005, () => console.log(`Server running at http://localhost:3005/`));