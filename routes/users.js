import { readBody } from "../utils/readBody.js";
import { validateUser } from "../utils/validateUser.js";
import users from "../utils/auth.js";

export async function usersGet(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

export async function usersPost(req, res) {
    const userBody = await readBody(req);
    const { valid, errors } = await validateUser(userBody);

    if (!valid) {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ errors }));
        return;
    }

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "User created" }));
}
