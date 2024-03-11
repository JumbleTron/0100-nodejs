import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import userSchema from '../schema/user.json' assert { type: "json" }

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(userSchema);

export const validateUser = async (userBody) => {
    const valid = validate(userBody);
    if (!valid) {
        return {
            valid: false,
            errors: validate.errors.map(err => ({
                field: err.instancePath.substring(1),
                message: err.message
            }))
        };
    }

    return { valid: true };
};
