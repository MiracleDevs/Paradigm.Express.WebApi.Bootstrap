import { Injectable } from "@miracledevs/paradigm-web-di";
import { ITopLevelDomain } from "../interfaces/top-level-domain.interface";

@Injectable()
export class TopLevelDomain implements ITopLevelDomain {
    id: number;
    name: string;

    constructor() {
        this.id = 0;
        this.name = "";
    }
}
