import { Injectable } from "@miracledevs/paradigm-web-di";
import { IForgotPasswordToken } from "../interfaces/forgot-password-token.interface";

@Injectable()
export class ForgotPasswordToken implements IForgotPasswordToken {
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
