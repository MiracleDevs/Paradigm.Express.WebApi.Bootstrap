import { Injectable } from "@miracledevs/paradigm-web-di";
import { IRole } from "../interfaces/role.interface";

@Injectable()
export class RoleView implements IRole {
    id: number;
    name: string;
    description: string;

    constructor() {
        this.id = 0;
        this.name = "";
        this.description = "";
    }
}
