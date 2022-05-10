import { Configuration } from "../configuration/configuration";
import { Injectable, DependencyLifeTime, DependencyContainer } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext, RoutingContext, ConfigurationBuilder } from "@miracledevs/paradigm-express-webapi";
import * as jwt from "jsonwebtoken";

/**
 * Provides the means to filter requests that expose sensitive information.
 * If this filter is decorated on actions, controllers or globally, will filter
 * all requests and ask for a given token, or the request will fail with a 401.
 */

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class RestorePasswordFilter implements IFilter {
    // -- Jwt Secret
    private jwt_secret: string;
    // -- Token lifetime
    private token_lifetime: string;

    constructor(private readonly configurationBuilder: ConfigurationBuilder, private readonly dependencyContainer: DependencyContainer) {
        // -- Build config
        const configuration = configurationBuilder.build(Configuration);
        // -- Take values
        this.jwt_secret = configuration.clientSecret;
        this.token_lifetime = configuration.sessionTimeout;
    }

    async beforeExecute(httpContext: HttpContext, _: RoutingContext): Promise<void> {
        // -- Take the token from header
        const basicHeader = <string>httpContext.request.headers["x-auth"];

        try {
            if (basicHeader) {
                // -- Split
                const basic = basicHeader.split(" ");
                // -- Take token value
                const token = basic[1];

                let jwtPayload;
                // -- Verify token
                jwtPayload = <any>jwt.verify(token, this.jwt_secret);
                // -- Set the payload in the response to have access later
                httpContext.response.locals.restorePasswordToken = token;
            } else {
                httpContext.response.status(401).send();
                return;
            }
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            httpContext.response.status(401).send();
            return;
        }
    }
}
