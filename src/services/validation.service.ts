import moment from "moment";
import csv from "csvtojson";
import { promises as dnsPromises } from "dns";
import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { HttpClient, NodeFetcher } from "@miracledevs/paradigm-web-fetch";
import { promiseWithTimeout } from "../utils/promiseWithTimeout";
import { TopLevelDomainsRepository } from "../repositories/top-level-domains.repository";
import { TopLevelDomain } from "../entities/models/top-level-domain.model";
import { AreaCodeRepository } from "../repositories/area-code.repository";
import { AreaCode } from "../entities/models/area-code.model";
import isCreditCard from "../utils/isCreditCard";

interface IRegExps {
    email: RegExp;
    string: RegExp;
    tel: RegExp;
    number: RegExp;
}

export interface IValidationResult {
    errors: IErrorMessage[];
    isValid: boolean;
}

export interface IErrorMessage {
    field: string;
    messages: string[];
}

export const regExps: IRegExps = {
    // TODO: Add password
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    string: /^[A-Za-z.\s_-]+$/,
    tel: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    number: /^[0-9]*$/,
};

export const getErrorMessage = (field: string, label: string, validationType: string, metadata?: string | number): IErrorMessage => {
    let errorMessage = "";

    switch (validationType) {
        case "text":
            errorMessage = label + ": can only contain letters";

            break;
        case "date":
            errorMessage = label + ": Date format is incorrect";

            break;
        case "email":
            errorMessage = label + ": The email format is incorrect";

            break;
        case "tel":
            errorMessage = label + ": The telephone format is incorrect";

            break;
        case "required":
            errorMessage = label + ": This field is required";

            break;
        case "maxLength":
            errorMessage = label + `: The maximum number of characters allowed is ${metadata}`;

            break;

        case "creditCard":
            errorMessage = label + ": Wrong credit card number";

            break;
        case "minDate":
            errorMessage = label + ": Date is older than today";

            break;
        case "number":
            errorMessage = label + ": Input can only contain numbers";

            break;
    }

    return {
        field,
        messages: [errorMessage],
    };
};

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class ValidationService {
    private readonly httpClient: HttpClient;

    constructor(private readonly topLevelDomainsRepository: TopLevelDomainsRepository, private readonly areaCodeRepository: AreaCodeRepository) {
        this.httpClient = new HttpClient();
        var nodeFetcher = new NodeFetcher();
        this.httpClient.setFetcher(nodeFetcher);
    }

    public async setValidation(val: any, type: string, metadata?: any): Promise<boolean> {
        let isValid: any = true;

        switch (type) {
            case "text":
                if (val) isValid = this.validateValue(val, regExps.string);

                break;
            case "email":
                if (val) isValid = await this.isValidEmail(val);

                break;
            case "tel":
                if (val) {
                    val = val.replace(/\D/g, "");
                    isValid = this.validateValue(val, regExps.tel);
                }
                break;
            case "number":
                isValid = this.validateValue(val, regExps.number);

                break;
            case "required":
                isValid = this.required(val);

                break;
            case "maxLength":
                isValid = this.maxLength(val, metadata);

                break;
            case "minLength":
                isValid = this.minLength(val, metadata);

                break;
            case "equalsTo":
                isValid = this.equalsTo(val, metadata);

                break;
            case "date":
                if (val) isValid = this.isDate(val);
                break;
            case "minDate":
                if (val) isValid = this.minDate(val, metadata);
                break;
            case "maxDate":
                if (val) isValid = this.maxDate(val, metadata);
                break;
            case "creditCard":
                if (val) isValid = this.isCreditCard(val);

                break;
            default:
                isValid = true;
        }

        return isValid;
    }

    private validateValue(val: any, regExp: RegExp): boolean {
        const validation = new RegExp(regExp);
        const ok = validation.test(val);

        return ok && val && val !== "";
    }

    public async validateSchema(validationSchema: any, requestBody: any): Promise<IValidationResult> {
        const errors: IErrorMessage[] = [];

        for (const fieldName in requestBody) {
            const { value, label } = requestBody[fieldName];

            if (validationSchema[fieldName]) {
                const { validations } = validationSchema[fieldName];

                for (const validationKey in validations) {
                    const validationValue = validations[validationKey];

                    if (typeof validationValue !== "object") {
                        const validationResult: any = await this.setValidation(value, validationKey, validationValue);

                        const isValid = validationResult?.success || validationResult;

                        if (!isValid) {
                            const error = getErrorMessage(fieldName, label, validationKey, validationValue);

                            const pushedError = errors.find((e: IErrorMessage) => e.field === fieldName);

                            if (pushedError) {
                                pushedError.messages.push(error.messages[0]);
                            } else {
                                errors.push(error);
                            }
                        }
                    }
                }
            }
        }

        return { errors, isValid: !errors.length };
    }

    private required(val: any): boolean {
        let isValid = false;

        if (typeof val === "string") {
            isValid = val && val.length > 0;
        } else {
            isValid = val;
        }

        return isValid;
    }

    private minLength(val: any, length: number): boolean {
        return val ? val.length >= length : true;
    }

    private maxLength(val: any, length: number): boolean {
        return val ? val.length <= length : true;
    }

    private minDate(date: string, mDate: Date): boolean {
        const _date = new Date(date);
        let minDate, currentDate;

        if (this.isDate(_date)) {
            currentDate = new Date(_date).getTime();
            minDate = new Date(mDate).getTime();
        } else {
            const [month, year] = date.split("/");
            const fullDate = `${month}-01-${year}`;

            currentDate = new Date(fullDate).getTime();
            minDate = new Date(mDate).getTime();
        }

        return minDate < currentDate;
    }

    private maxDate(date: string, mDate: Date): boolean {
        const _date = new Date(date);
        let maxDate, currentDate;

        if (this.isDate(_date)) {
            currentDate = new Date(_date).getTime();
            maxDate = new Date(mDate).getTime();
        } else {
            const [month, year] = date.split("/");
            const fullDate = `${month}-01-${year}`;

            currentDate = new Date(fullDate).getTime();
            maxDate = new Date(mDate).getTime();
        }

        return maxDate > currentDate;
    }

    private equalsTo(password1: string, password2: string): boolean {
        return password1 === password2;
    }

    private isDate(date: Date): boolean {
        return moment(date).isValid();
    }

    private isCreditCard(value: string) {
        return isCreditCard(value);
    }

    public async updatePhoneAreaCodes(): Promise<any> {
        // Area code Reports updated daily.
        // https://nationalnanpa.com/nanp1/npa_report.csv
        let csvFile = await (await this.httpClient.get("https://nationalnanpa.com/nanp1/npa_report.csv")).text();
        // Remove first line of csv. Since it's only the Date of the update.
        let lines = csvFile.split("\n");
        lines.splice(0, 1);
        csvFile = lines.join("\n");

        csv()
            .fromString(csvFile)
            .then(
                json => {
                    for (let item of json) {
                        var areaCodeObj: AreaCode = new AreaCode();
                        if (item.IN_SERVICE === "Y") {
                            areaCodeObj.areaCode = item["NPA_ID"];
                            areaCodeObj.location = item["LOCATION"];
                            areaCodeObj.region = item["COUNTRY"];
                            this.areaCodeRepository.insert(areaCodeObj);
                        }
                    }
                    return this.areaCodeRepository.apply();
                },
                () => false
            );
    }

    public async checkPhoneNumber(phone: string): Promise<boolean> {
        let isValid = this.validateValue(phone, regExps.tel);
        //Replace non-numeric characters
        if (isValid) {
            phone = phone.replace(/[^0-9]+/g, "");
            let areacode = Number(phone.slice(0, 3));
            let found = await this.areaCodeRepository.find(`areaCode=?`, [areacode]);
            // Log that the number Area Code Fail.
            return found.length > 0;
        } else {
            return false;
        }
    }

    public async isValidEmail(value: string): Promise<any> {
        let isValid: boolean | object = this.validateValue(value, regExps.email);

        if (isValid) {
            let checkMXRecord = async function () {
                return new Promise((res, rej) => {
                    const hostname = value.split("@")[1];

                    try {
                        dnsPromises
                            .resolveMx(hostname)
                            .then(addresses => {
                                if (addresses && addresses.length > 0) {
                                    //console.log(addresses);
                                    addresses[0].exchange ? res({ success: true, error: "" }) : res({ success: false, error: "" });
                                }
                            })
                            .catch(err => {
                                // TODO: Deal with the error
                                console.log("Resolve Mx ERROR:\n" + err);
                                res({ success: false, error: "Resolve MX Error" });
                            });
                    } catch (err) {
                        // TODO: Deal with the error
                        console.log("Validate Email ERROR:\n" + err);
                        res({ success: true, error: "Error" });
                    }
                });
            };

            isValid = await promiseWithTimeout(3000, checkMXRecord, "Check timed out");
        }

        return isValid;
    }

    public async checkTopLevelDomain(email: string): Promise<boolean> {
        let isValid = this.validateValue(email, regExps.email);

        if (isValid) {
            const hostname = email.split("@")[1];
            const domains = hostname.split(".");
            const topLevelDomain = domains[domains.length - 1];

            let domainName = topLevelDomain.toUpperCase();
            let found = await this.topLevelDomainsRepository.find(`name = ?`, [domainName]);

            return found.length > 0;
        } else {
            return false;
        }
    }

    public async updateTopLevelDomains(): Promise<any> {
        let topLevelDomains = await (await (await this.httpClient.get("https://data.iana.org/TLD/tlds-alpha-by-domain.txt")).text()).split("\n").slice(1);

        for (let item of topLevelDomains) {
            if (item.length > 0) {
                let domain = new TopLevelDomain();
                domain.name = item;
                this.topLevelDomainsRepository.insert(domain);
            }
        }

        return this.topLevelDomainsRepository.apply();
    }

    public async validateRecaptacha(body: any): Promise<boolean> {
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${body.secret}&response=${body.response}`;
        const response: any = await (await this.httpClient.post(url, null, null)).json();

        return response.success;
    }
}
