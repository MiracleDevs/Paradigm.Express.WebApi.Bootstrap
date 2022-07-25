import { Action, ApiController, Controller } from "@miracledevs/paradigm-express-webapi";
import { MySqlConnection } from "../core/mysql/mysql.connection";

@Controller({ route: "/api/health" })
export class HealthController extends ApiController {
    constructor(private connection: MySqlConnection) {
        super();
    }

    @Action({ route: "/" })
    async get(): Promise<void> {
        try {
            await this.connection.connection.ping();
            this.httpContext.response.sendStatus(200);
            return;
        } catch {
            this.httpContext.response.sendStatus(500);
            return;
        }
    }
}
