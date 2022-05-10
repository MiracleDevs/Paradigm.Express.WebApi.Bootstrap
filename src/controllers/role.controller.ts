import { Action, ApiController, Controller } from "@miracledevs/paradigm-express-webapi";
import { RoleView } from "../entities/views/role.view";
import { RoleViewRepository } from "../repositories/role-view.repository";

@Controller({ route: "/api/role" })
export class RoleController extends ApiController {
    constructor(private readonly repository: RoleViewRepository) {
        super();
    }

    @Action({ route: "/" })
    async get(): Promise<RoleView[]> {
        return await this.repository.getAll();
    }

    @Action({ route: "/:id" })
    async getById(id: number): Promise<RoleView> {
        return await this.repository.getById(id);
    }
}
