import { Injectable } from "@miracledevs/paradigm-web-di";
import { IUser } from "../interfaces/user.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class User implements IUser {
    id: number;
    roleId: number;
    companyId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    registrationDate: Date;
    passwordHash: string;

    constructor() {
        this.id = 0;
        this.roleId = 5;
        this.companyId = 1;
        this.userName = "";
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.registrationDate = new Date();
        this.passwordHash = "";
    }

    hashPassword() {
        this.passwordHash = bcrypt.hashSync(this.passwordHash, 10);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.passwordHash);
    }
}
