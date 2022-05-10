import { Injectable } from "@miracledevs/paradigm-web-di";
import { IAccessLog } from "../interfaces/access-log.interface";

@Injectable()
export class AccessLog implements IAccessLog {
    id: number;
    method: string;
    message: string;
    json: string;
    type: number;
    creationDate: Date;
    active: boolean;
    processId: string;

    constructor() {
        this.id = 0;
        this.method = '';
        this.message = '';
        this.json = '';
        this.type = 1;
        this.active = false;
        this.creationDate = new Date();
        this.processId = '';
    }
}