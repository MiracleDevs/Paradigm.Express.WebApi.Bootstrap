import { AuthorizationInterceptor } from "@miracledevs/paradigm-web-fetch/interceptors/authorization.interceptor";
import { ContentTypeInterceptor } from "@miracledevs/paradigm-web-fetch/interceptors/content-type.interceptor";
import { HttpClient, QueryString } from "@miracledevs/paradigm-web-fetch/http-client";
import { NodeFetcher } from "@miracledevs/paradigm-web-fetch/fetchers/node.fetcher";
import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

@Injectable({ lifeTime: DependencyLifeTime.Singleton })
export class ApiClient {
    private readonly httpClient: HttpClient;

    constructor(private readonly baseUrl: string) {
        this.httpClient = new HttpClient();
        const nodeFetcher = new NodeFetcher();
        this.httpClient.setFetcher(nodeFetcher);
        this.httpClient.registerInterceptor(new ContentTypeInterceptor("application/json"));
    }

    authorize(token: string): void {
        this.httpClient.registerInterceptor(new AuthorizationInterceptor(token));
    }

    async get<TResult>(url: string, queryString?: QueryString): Promise<TResult> {
        return (await (await this.httpClient.get(`${this.baseUrl}/${url}`, queryString)).json()) as TResult;
    }

    async post<TResult>(url: string, queryString?: QueryString, body?: BodyInit): Promise<TResult> {
        return (await (await this.httpClient.post(`${this.baseUrl}/${url}`, queryString, body)).json()) as TResult;
    }

    async put<TResult>(url: string, queryString?: QueryString, body?: BodyInit): Promise<TResult> {
        return (await (await this.httpClient.put(`${this.baseUrl}/${url}`, queryString, body)).json()) as TResult;
    }

    async patch<TResult>(url: string, queryString?: QueryString, body?: BodyInit): Promise<TResult> {
        return (await (await this.httpClient.patch(`${this.baseUrl}/${url}`, queryString, body)).json()) as TResult;
    }

    async delete<TResult>(url: string, queryString?: QueryString): Promise<TResult> {
        return (await (await this.httpClient.delete(`${this.baseUrl}/${url}`, queryString)).json()) as TResult;
    }
}
