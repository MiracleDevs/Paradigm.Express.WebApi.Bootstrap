import { DependencyCollection, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { IHttpInterceptor } from "@miracledevs/paradigm-web-fetch/interceptors/http-interceptor.interface";
import { HttpRequest, HttpResponse } from "@miracledevs/paradigm-web-fetch";

export class AuthInterceptor implements IHttpInterceptor {
    private authToken: string = null;

    constructor() {
        const container = DependencyCollection.globalCollection.buildContainer();
    }

    private requestAuthToken(request: HttpRequest): HttpRequest {
        const urlWithToken = new URL(request.url);
        urlWithToken.searchParams.delete("authToken");
        urlWithToken.searchParams.append("authToken", this.authToken);
        //Forcing new URL for request;
        let newRequest = request as any;
        newRequest.url = urlWithToken.href;
        return newRequest as HttpRequest;
    }

    beforeSend(request: HttpRequest): Promise<HttpRequest> | HttpRequest {
        return this.requestAuthToken(request);
    }

    afterReceive(response: HttpResponse): Promise<HttpResponse> | HttpResponse {
        return response;
    }
}
