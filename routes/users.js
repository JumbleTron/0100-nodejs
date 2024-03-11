import Ajv from "ajv";
import addFormats from "ajv-formats"
import userSchema from '../schema/user.json' assert { type: "json" }

export const users = [
    { id: 49, username: 'maciek', password: 'haslo'},
];

export const usersGet = (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(users));
}

export const usersGetId = (req, res, objectId) => {
    const user = users.find(u => u.id === objectId);
    if (!user) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(user));
}

export const usersPost = (req, res) => {
    const userBody = req.body
    const ajv = new Ajv({ allErrors: true })
    addFormats(ajv)
    const validate = ajv.compile(userSchema)
    const valid = validate(userBody)

    if (!valid) {
        res.writeHead(422, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(validate.errors));
        return''
    }
    let lastId = 0;
    users.map((user) => {
        lastId = Math.max(lastId, user.id);
    });

    const user = {
        id: lastId + 1,
        username: userBody.username,
        password: ''
    }

    res.writeHead(201, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(user));
}