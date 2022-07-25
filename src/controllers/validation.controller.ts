import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { ValidationService } from "../services/validation.service";

@Controller({ route: "/api/validate" })
export class ValidationController extends ApiController {
    constructor(private readonly validationService: ValidationService) {
        super();
    }

    @Action({ route: "/updateTopLevelDomains", method: HttpMethod.POST })
    async updateTopLevelDomains(): Promise<boolean> {
        try {
            await this.validationService.updateTopLevelDomains();
            return true;
        } catch (e) {
            console.log("Top level domains update fail:\n", e);
            return false;
        }
    }

    @Action({ route: "/updatePhoneAreaCodes", method: HttpMethod.POST })
    async updatePhoneAreaCodes(): Promise<boolean> {
        try {
            await this.validationService.updatePhoneAreaCodes();
            return true;
        } catch (e) {
            console.log("Phone Area Codes update fail:\n", e);
            return false;
        }
    }

    @Action({ route: "/email", fromBody: true, method: HttpMethod.POST })
    async validateEmail(callDto: any): Promise<any> {
        console.log(callDto, this.httpContext.request.body);
        let value = callDto.email;
        if (await this.validationService.checkTopLevelDomain(value)) {
            let result = await this.validationService.isValidEmail(value);

            if (!result && !result.success) {
                console.log("Error validating email: ", result.error);
            }

            return { ...result, isValid: result.success };
        }

        return { success: false, isValid: false };
    }

    @Action({ route: "/phone", fromBody: true, method: HttpMethod.POST })
    async validatePhonePrefix(callDto: any): Promise<any> {
        let phoneNumber = callDto.phone;

        let result = await this.validationService.checkPhoneNumber(phoneNumber);
        return { success: result, isValid: result };
    }
}
