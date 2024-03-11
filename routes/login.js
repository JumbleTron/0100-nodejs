import passport from 'passport';
import * as fs from 'fs';

export const loginGet = (req, res) => {
  //@todo show failureMessage
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream('public/login.html').pipe(res);
};

export const loginPost = (req, res) => {
  passport.authenticate('local', {
    successReturnToOrRedirect: '/users',
    failureRedirect: 'login',
    failureMessage: false,
  })(req, res);
};
