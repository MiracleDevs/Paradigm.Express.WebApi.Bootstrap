import { ApiServer } from "@miracledevs/paradigm-express-webapi";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../docs/swagger.json";
import NodeCache from "node-cache";
import { useNodeCacheAdapter } from "type-cacheable";
import { MySqlConnectionFilter } from "./filters/mysql.filter";
import { RoleController } from "./controllers/role.controller";
import { AuthController } from "./controllers/auth.controller";
import { ValidationController } from "./controllers/validation.controller";
import { HealthController } from "./controllers/health.controller";
import { PrimsaController } from "./controllers/prisma.controller";

/**
 * Represents the api server application.
 * It contains the main DI container, the router and express application.
 */
export class ParadigmApiServer extends ApiServer {
    /**
     * Configures the server before starting.
     */
    protected configureApplication(): void {
        this.logger.debug("Configuring application...");
        const port = process.env.PORT || 5000;

        const client = new NodeCache();
        client.options.stdTTL = 86400;
        useNodeCacheAdapter(client);

        this.expressApplication
            .disable("etag")
            .set("port", port)
            .use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
            .use(cors({ exposedHeaders: "x-auth" }))
            .use(express.urlencoded({ extended: false }))
            .use(express.json())
            .listen(port, () => this.logger.debug(`Listening on: http://localhost:${port}`));

        this.registerControllers([RoleController, AuthController, ValidationController, HealthController, PrimsaController]);

        this.routing.ignoreClosedResponseOnFilters();

        this.routing.registerGlobalFilters([MySqlConnectionFilter]);
    }
}
