import { Action, ApiController, ConfigurationBuilder, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import * as jwt from "jsonwebtoken";
import { Configuration } from "../configuration/Configuration";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/models/user.model";
import { ClientSecretFilter } from "../filters/client-secret.filter";
import { IErrorMessage, IValidationResult, ValidationService } from "../services/validation.service";
import { userValidationSchema } from "../schemas/user-validation.schema";
import { AuthRequestDTO } from "../entities/interfaces/dto/auth.dto";
import { Path, POST, Accept, Security } from "typescript-rest";
import { Tags, Response } from "typescript-rest-swagger";

@Path("/api/auth")
@Tags("Resource Files")
@Controller({ route: "/api/auth" })
export class AuthController extends ApiController {
    private jwtSecret: string;
    private tokenLifeTime: string;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly configurationBuilder: ConfigurationBuilder,
        private readonly validationService: ValidationService
    ) {
        super();
        const configuration = configurationBuilder.build(Configuration);
        this.jwtSecret = configuration.clientSecret;
        this.tokenLifeTime = configuration.sessionTimeout;
    }

    @POST
    @Path("/login")
    @Accept("application/json")
    @Security("client secret")
    @Response<string>(200, "Retrieves an access token.")
    @Response<string>(401, "The user is not authenticated.", "The user is not authenticated.")
    @Action({ route: "/login", method: HttpMethod.POST })
    async login(): Promise<string> {
        const dto: AuthRequestDTO = this.httpContext.request.body;
        const { username, password } = dto;

        if (!(username && password)) {
            this.httpContext.response.sendStatus(400);
            return;
        }
        // Get user from database
        let user: User;
        try {
            user = await this.userRepository.getByUsername(username);
        } catch (error) {
            this.httpContext.response.sendStatus(401);
            return;
        }

        // Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            this.httpContext.response.sendStatus(401);
            return;
        }

        // Sing JWT, valid for {token_lifetime}
        const token = jwt.sign({ userId: user.id, username: user.userName }, this.jwtSecret, { expiresIn: this.tokenLifeTime });

        // Send the jwt in the response
        return token;
    }

    @Action({ route: "/changePassword", method: HttpMethod.POST, filters: [ClientSecretFilter] })
    async changePassword(): Promise<{ success: boolean }> {
        const { userId } = this.httpContext.response.locals.jwtPayload;
        const { oldPassword, newPassword } = this.httpContext.request.body;
        if (!(oldPassword && newPassword)) {
            this.httpContext.response.sendStatus(400);
            return;
        }

        let user: User;
        try {
            user = await this.userRepository.getById(userId);
        } catch (error) {
            this.httpContext.response.sendStatus(401);
            return;
        }

        // Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            this.httpContext.response.sendStatus(401);
            return;
        }

        // TODO: Validate the new password.
        user.passwordHash = newPassword;
        user.hashPassword();

        // TODO: Send email validation.
        return { success: true };
    }

    @Action({ route: "/register", method: HttpMethod.POST })
    async createNewUser(): Promise<{ success: boolean; errors: IErrorMessage[] }> {
        const { body } = this.httpContext.request;

        const obj = {
            ...body.user,
        };

        const validationResult: IValidationResult = await this.validationService.validateSchema(userValidationSchema, obj);

        return { success: validationResult.isValid, errors: validationResult.errors };
    }
}
