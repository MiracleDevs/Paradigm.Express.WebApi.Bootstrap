import { Injectable } from "@miracledevs/paradigm-web-di";
import { IEmailTemplate } from "../interfaces/email-template.interfaces";

@Injectable()
export class EmailTemplate implements IEmailTemplate {
    id: number;
    name: string;
    formName: string;
    division: number;
    template: string;
    subject: string;
    from: string;

    constructor() {
        this.id = 0;
        this.name = "";
        this.formName = "";
        this.division = 0;
        this.template = "";
        this.subject = "";
        this.from = "";
    }
}
