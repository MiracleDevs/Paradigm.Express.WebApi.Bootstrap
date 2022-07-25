import { Injectable } from "@miracledevs/paradigm-web-di";
import { IAddress } from "../interfaces/address.interface";

@Injectable()
export class Address implements IAddress {
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    provinceState: string;
    city: string;
    country: string;

    constructor() {
        this.addressLine1 = "";
        this.addressLine2 = "";
        this.postalCode = "";
        this.provinceState = "";
        this.city = "";
        this.country = "";
    }
}
