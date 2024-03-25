import passport from "passport";
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

export let users = [
    { id: 49, username: 'maciek', password: 'maciek' },
];

const findUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

const comparePasswords = (providedPassword, storedPassword) => {
    return bcrypt.compare(providedPassword, storedPassword);
};

passport.use('local', new LocalStrategy(
    async function (username, password, done) {
        const user = await findUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
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

export default passport;
