import {Response} from "express";

export function badQueryParams(res: Response, propertyName: string): void {
    res.statusCode = 400;
    res.send({result: `${propertyName} must be passed`, status_code: 400});
}


export async function responseLogic(res: Response, prom: Promise<any>): Promise<void> {
    try {
        let result = await prom;
        res.send({result: result, status_code: 200});
    } catch (err) {
        res.statusCode = 400;
        res.send({result: err.message, status_code: 400});
    }
}