import fs from "fs";
import passport from "passport";

export async function loginGet(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('public/login.html').pipe(res);
}

export async function loginPost(req, res) {
    passport.authenticate('local', {
        successReturnToOrRedirect: '/users',
        failureRedirect: 'login',
        failureMessage: false,
    })(req, res)
}
