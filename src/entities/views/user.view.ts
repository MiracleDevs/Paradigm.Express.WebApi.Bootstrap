import { Injectable } from "@miracledevs/paradigm-web-di";
import { IUser } from "../interfaces/user.interface";

@Injectable()
export class UserView implements IUser {
    id: number;
    roleId: number;
    companyId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    registrationDate: Date;

    constructor() {
        this.id = 0;
        this.roleId = 0;
        this.companyId = 0;
        this.userName = "";
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.registrationDate = new Date();
    }
}
