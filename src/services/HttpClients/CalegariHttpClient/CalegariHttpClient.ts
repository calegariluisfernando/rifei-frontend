import { ICalegariHttpClient } from "./ICalegariHttpClient";

export default class CalegariHttpClient implements ICalegariHttpClient {

    private static _instance: CalegariHttpClient;
    private readonly _headers: Headers;
    private readonly _baseUrl: string;

    private constructor() {

        this._headers = new Headers();

        if (process.env.hasOwnProperty('REACT_APP_API_CONTENT_TYPE_DEFAULT')
            && process.env.REACT_APP_API_CONTENT_TYPE_DEFAULT) {

            this._headers.append("Content-Type", process.env.REACT_APP_API_CONTENT_TYPE_DEFAULT);
        }

        this._baseUrl = process.env.REACT_APP_BASE_URL_API || '';
    }

    private static handleErrors(res: Response): Response {

        if (!res.ok) throw new Error(res.statusText);
        return res;
    }

    private static buildQueryUrl(url: string): string {

        let newUrl = url;
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

            let urlPars = url.split('?');
            let stringParams = urlPars.length > 1 ? urlPars.pop() : undefined;
            let searchParams = new URLSearchParams(stringParams);

            if ((process.env.hasOwnProperty('REACT_APP_DEBUG_PARAM_NAME') && process.env.REACT_APP_DEBUG_PARAM_NAME)
                && (process.env.hasOwnProperty('REACT_APP_DEBUG_PARAM_VALUE') && process.env.REACT_APP_DEBUG_PARAM_VALUE)) {

                searchParams.append(
                    process.env.REACT_APP_DEBUG_PARAM_NAME,
                    process.env.REACT_APP_DEBUG_PARAM_VALUE
                );
            }

            newUrl = urlPars.concat([searchParams.toString()]).join('?');
        }

        return newUrl;
    }

    public static getInstance(): CalegariHttpClient {

        if (!CalegariHttpClient._instance) {

            CalegariHttpClient._instance = new CalegariHttpClient();
        }

        return CalegariHttpClient._instance;
    }

    get headers(): Headers {

        return this._headers;
    }

    get baseUrl(): string {

        return this._baseUrl;
    }

    setToken(token: string): void {

        this.headers.delete('Authorization');
        this.headers.append('Authorization', `Bearer ${token}`);
    }

    get(url: string): Promise<any> {

        return fetch(CalegariHttpClient.buildQueryUrl(`${this.baseUrl}${url}`), { headers: this.headers })
            .then(res => CalegariHttpClient.handleErrors(res))
            .then(res => res.json());
    }

    post(url: string, data: any): Promise<any> {

        const options = {
            headers: this.headers,
            method: 'post',
            body: JSON.stringify(data)
        };

        return fetch(CalegariHttpClient.buildQueryUrl(`${this.baseUrl}${url}`), options)
            .then(res => CalegariHttpClient.handleErrors(res))
            .then(res => res.json());
    }

    put(url: string, data: any): Promise<any> {

        const options = {
            headers: this.headers,
            method: 'put',
            body: JSON.stringify(data)
        };

        return fetch(CalegariHttpClient.buildQueryUrl(`${this.baseUrl}${url}`), options)
            .then(res => CalegariHttpClient.handleErrors(res))
            .then(res => res.json());
    }

    delete(url: string): Promise<any> {

        const options = {
            headers: this.headers,
            method: 'delete'
        };

        return fetch(CalegariHttpClient.buildQueryUrl(`${this.baseUrl}${url}`), options)
            .then(res => CalegariHttpClient.handleErrors(res))
            .then(res => res.json());
    }
}