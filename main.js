import http from 'http';
import bodyParser from 'body-parser';
import helmet from "helmet";
import passport from "passport";
import LocalStrategy from 'passport-local';
import useRouter from "./router.js";
import { users } from "./routes/users.js";

const PORT = process.env.port || 3000;


passport.use('local', new LocalStrategy(
	function(username, password, done) {
		const user = users.filter((user) => user.username === username).pop()
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


const applyHelmetHeaders = helmet(); //https://www.npmjs.com/package/helmet#content-security-policy
const server = http.createServer(async (req, res) => {
	res.redirect = (url) => {
		res.writeHead(302, {
			location: url,
		});
		res.end();
	};
	applyHelmetHeaders(req, res, () => {
		bodyParser.urlencoded({ extended: false })(req, res, () => {
			passport.authenticate('session')(req, res, () => {
				useRouter(req, res);
			});
		});
	});
});

try {
	server.listen(PORT, () => {
		console.log(`Server running at http://localhost:${PORT}/`);
	});
} catch (error) {
	console.log(error.message);
	process.exit(1);
}
