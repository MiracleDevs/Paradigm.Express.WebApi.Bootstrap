import { RequestDTO } from "./request.dto";

export interface AuthRequestDTO extends RequestDTO {
    username: string;
    password: string;
}
