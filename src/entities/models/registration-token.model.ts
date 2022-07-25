import { Injectable } from "@miracledevs/paradigm-web-di";
import { IRegistrationToken } from "../interfaces/registration-token.interface";

@Injectable()
export class RegistrationToken implements IRegistrationToken {
    id: number;
    userName: string;
    roleId: string;
    token: string;
    active: boolean;
    creationDate: Date;

    constructor() {
        this.id = 0;
        this.userName = "";
        this.roleId = "";
        this.token = "";
        this.active = false;
        this.creationDate = new Date();
    }
}
