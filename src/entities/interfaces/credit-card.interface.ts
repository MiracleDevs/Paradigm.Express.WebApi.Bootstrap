export interface ICreditCardData {
    name: string;
    number: string;
    expiration: {
        month: string;
        year: string;
    };
    creditCardType?: string;
    address: {
        address1: string;
        address2: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface ICreditCardTokenData {
    token: string;
    creditCardType: string;
    creditCardMask: string;
    refId: string;
    extendedAccountType: string;
}
