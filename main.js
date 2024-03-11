import http from 'http';
import helmet from "helmet";
import passport from './utils/auth.js';
import { useRouter } from './useRouter.js';

const applyHelmetHeaders = helmet();

const server = http.createServer(async (req, res) => {
	res.redirect = (url) => {
		res.writeHead(302, {
			location: url,
		});
		res.end();
	}
	applyHelmetHeaders(req, res, () => {
		bodyParser.urlencoded({ extended: false })(req, res, () => {
			passport.authenticate('session')(req, res, () => {
				useRouter(req, res);
			});
		});
	});
});

server.listen(process.env.PORT ?? 3005, () => console.log(`Server running at http://localhost:3005/`));