export const formValidationSchema = {
    email: {
        type: "text",
        validations: {
            maxLength: 255,
            required: true,
            text: true,
        },
    },
    phone: {
        type: "text",
        validations: {
            required: true,
            tel: true,
        },
    },
};
