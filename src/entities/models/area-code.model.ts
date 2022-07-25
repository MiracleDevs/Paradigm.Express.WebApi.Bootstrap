import { Injectable } from "@miracledevs/paradigm-web-di";
import { IAreaCode } from "../interfaces/area-code.interface";

@Injectable()
export class AreaCode implements IAreaCode {
    id: number;
    areaCode: number;
    location: string;
    region: string;

    constructor() {
        this.id = 0;
        this.areaCode = 0;
        this.location = "";
        this.region = "";
    }
}
