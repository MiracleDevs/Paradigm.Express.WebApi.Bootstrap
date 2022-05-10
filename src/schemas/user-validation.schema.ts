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
    birth_date: {
        type: "date",
        validations: {
            required: true,
            date: true,
        },
    },
    gender: {
        type: "text",
        validations: {
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
    card_name: {
        type: "text",
        validations: {
            required: true,
        },
    },
    card_number: {
        type: "text",
        validations: {
            required: true,
            creditCard: true,
        },
    },
    card_expiration: {
        name: "card_expiration",
        type: "text",
        validations: {
            required: true,
        },
    },
    billing_address_1: {
        type: "text",
        validations: {
            required: true,
        },
    },
    billing_address_2: {
        type: "text",
    },
    billing_state: {
        type: "text",
        validations: {
            required: true,
        },
    },
    billing_zip_code: {
        type: "text",
        validations: {
            required: true,
        },
    },
    billing_city: {
        type: "text",
        validations: {
            required: true,
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
    },
    locationId: {
        type: "number",
        validations: {
            required: true,
        },
    },
};
