import { Configuration } from "../configuration/configuration";
import { Injectable, DependencyLifeTime, DependencyContainer } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext, RoutingContext, ConfigurationBuilder } from "@miracledevs/paradigm-express-webapi";
import { UserRepository } from "../repositories/user.repository";

/**
 * Provides the means to filter requests that expose sensitive information.
 * If this filter is decorated on actions, controllers or globally, will filter
 * all requests and ask for a given token, or the request will fail with a 401.
 */

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class AdminAuthFilter implements IFilter {
    constructor(
        private readonly configurationBuilder: ConfigurationBuilder,
        private readonly userRepository: UserRepository,
        private readonly dependencyContainer: DependencyContainer
    ) {
        const configuration = configurationBuilder.build(Configuration);
    }

    async beforeExecute(httpContext: HttpContext, _: RoutingContext): Promise<void> {
        const basicHeader = <string>httpContext.request.headers["authorization"];

        try {
            if (basicHeader) {
                const basic = basicHeader.split(" ");
                const basicToken = basic[1];

                const buff = Buffer.from(basicToken, "base64");
                const decodedToken = buff.toString().split(":");
                const user = decodedToken[0] as any;
                const pass = decodedToken[1] as any;

                let userData = await this.userRepository.getByUsername(user);
                const validPassword = userData.checkIfUnencryptedPasswordIsValid(pass);

                if (!user || !pass || !validPassword || userData.roleId != 4) {
                    throw new Error();
                }

                httpContext.response.locals.basicPayload = {
                    user: {
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        role: userData.roleId,
                    },
                };
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
