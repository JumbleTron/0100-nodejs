import fs from "fs";
import passport from "passport";

export async function loginGet(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('public/login.html').pipe(res);
}

export async function loginPost(req, res, cb) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return cb(err);
        if (!user) {
            console.log("Logowanie nieudane: ", info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) return cb(err);
            return res.redirect('/users');
        });
    })(req, res, cb);
}