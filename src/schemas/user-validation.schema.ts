export const userValidationSchema = {
    name: {
        type: "text",
        validations: {
            maxLength: 255,
            required: true,
            text: true,
        },
    },
    last_name: {
        type: "text",
        validations: {
            maxLength: 255,
            required: true,
            text: true,
        },
    },
    email: {
        type: "email",
        validations: {
            maxLength: 255,
            email: true,
            required: true,
        },
    },
    address_1: {
        type: "text",
        validations: {
            required: true,
        },
    },
    address_2: {
        type: "text",
    },
    phone: {
        type: "text",
        validations: {
            required: true,
            tel: true,
        },
    },
    state: {
        type: "text",
        validations: {
            required: true,
        },
    },
    zip_code: {
        type: "text",
        validations: {
            required: true,
        },
    },
    city: {
        type: "text",
        validations: {
            required: true,
        },
    }
};
