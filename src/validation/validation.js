import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false
    });

    if (result.error) {
        const errors = {};
        result.error.details.forEach(detail => {
            errors[detail.context.key] = detail.message;
        });
        throw new ResponseError(400, errors);
    } else {
        return result.value;
    }
}

export {
    validate
}
