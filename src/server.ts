import express, {Request, Response} from "express";
import {IgApiClient} from 'instagram-private-api';
import config from "./config";
import {getPostInfo, getProfileInfo, getStories, login} from "./instagram";
import {badQueryParams, responseLogic} from "./utils";
import {createClient} from "redis";
// @ts-ignore
import Signer from 'tiktok-signature';

const ig = new IgApiClient();
const app = express();
const signer = new Signer();
const redis_client = createClient({url: config.redis_url});

app.get("/stories", async (req: Request, res: Response) => {
    let user_name = req.query.user_name;
    if (!user_name) return badQueryParams(res, "user_name");
    const redisStoriesKey = `instagram:stories:${user_name}`;
    redis_client.get(redisStoriesKey, async (err: Error | null, value: string | null) => {
        if (value) {
            res.send(JSON.parse(value));
        } else {
            const result = await responseLogic(res, getStories(ig, String(user_name)));
            redis_client.setex(redisStoriesKey, 600, JSON.stringify(result))
        }
    });
});

app.get("/profile", async (req: Request, res: Response) => {
    let user_name = req.query.user_name;
    if (!user_name) return badQueryParams(res, "user_name");
    const redisProfileKey = `instagram:profile:${user_name}`;
    redis_client.get(redisProfileKey, async (err, value) => {
        if (value) {
            res.send(JSON.parse(value));
        } else {
            const result = await responseLogic(res, getProfileInfo(ig, String(user_name)));
            redis_client.setex(redisProfileKey, 3600, JSON.stringify(result))
        }
    });
});

app.get("/post", async (req: Request, res: Response) => {
    let photo_cache = req.query.photo_cache;
    if (!photo_cache) return badQueryParams(res, "photo_cache");
    const redisPostKey = `instagram:post:${photo_cache}`;
    redis_client.get(redisPostKey, async (err, value) => {
        if (value) {
            res.send(JSON.parse(value));
        } else {
            const result = await responseLogic(res, getPostInfo(ig, String(photo_cache)));
            redis_client.setex(redisPostKey, 86400, JSON.stringify(result))
        }
    });
});

app.get("/signature", async (req: Request, res: Response) => {
    let url = req.query.url;
    if (!url) return badQueryParams(res, "url");
    const verifyFp = await signer.getVerifyFp();
    const signature = await signer.sign(url);
    res.send({signature: signature, verifyFp: verifyFp});
});

app.listen(config.port, async () => {
    console.log("Init signature generator");
    await signer.init();
    console.log("Connect to instagram");
    console.time("Connection time");
    await login(ig, config.userName, config.password);
    console.timeEnd("Connection time");
});
