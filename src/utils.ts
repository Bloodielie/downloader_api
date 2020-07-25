import {Response} from "express";

export function badQueryParams(res: Response, propertyName: string): void {
    res.statusCode = 400;
    res.send({result: `${propertyName} must be passed`, status_code: 400});
}


export async function responseLogic(res: Response, prom: Promise<any>): Promise<object> {
    try {
        let result = await prom;
        const response = {result: result, status_code: 200};
        res.send(response);
        return response
    } catch (err) {
        res.statusCode = 400;
        const response = {result: err.message, status_code: 400};
        res.send(response);
        return response
    }
}