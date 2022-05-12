import { Configuration } from "../configuration/configuration";
import { Injectable, DependencyLifeTime, DependencyContainer } from "@miracledevs/paradigm-web-di";
import { IFilter, ConfigurationBuilder, HttpContext, RoutingContext } from "@miracledevs/paradigm-express-webapi";
import * as jwt from "jsonwebtoken";

/**
 * Provides the means to filter requests that expose sensitive information.
 * If this filter is decorated on actions, controllers or globally, will filter
 * all requests and ask for a given token, or the request will fail with a 401.
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ClientSecretFilter implements IFilter {
    private jwt_secret: string;
    private token_lifetime: string;

    constructor(private readonly configurationBuilder: ConfigurationBuilder, private readonly dependencyContainer: DependencyContainer) {
        const configuration = configurationBuilder.build(Configuration);
        this.jwt_secret = configuration.clientSecret;
        this.token_lifetime = configuration.sessionTimeout;
    }

    beforeExecute(httpContext: HttpContext, _: RoutingContext): void {
        //Get the jwt token from the head
        const token = <string>httpContext.request.headers["x-auth"];
        let jwtPayload;

        //Try to validate the token and get data
        //Should we also save and check the token in the database?
        try {
            jwtPayload = <any>jwt.verify(token, this.jwt_secret);
            httpContext.response.locals.jwtPayload = jwtPayload;
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            httpContext.response.status(401).send();
            return;
        }

        //We want to send a new token on every request
        const { userId, username } = jwtPayload;
        const newToken = jwt.sign({ userId, username }, this.jwt_secret, {
            expiresIn: this.token_lifetime,
        });
        httpContext.response.setHeader("token", newToken);
    }
}
