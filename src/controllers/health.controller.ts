import { Action, ApiController, Controller } from "@miracledevs/paradigm-express-webapi";
import { RoleRepository } from "../repositories/role.repository";

@Controller({ route: "/api/health" })
export class HealthController extends ApiController {
    constructor(private readonly roleRepository: RoleRepository) {
        super();
    }

    @Action({ route: "/" })
    async get(): Promise<any> {
        try {
            await this.roleRepository.getById(1);
            this.httpContext.response.sendStatus(200);
            return;
        } catch {
            this.httpContext.response.sendStatus(500);
            return;
        }
    }
}
