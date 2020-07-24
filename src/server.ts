import express, {Request, Response} from "express";
import {IgApiClient} from 'instagram-private-api';
import config from "./config";
import {getPostInfo, getProfileInfo, getStories, login} from "./instagram";
import {badQueryParams, responseLogic} from "./utils";

const ig = new IgApiClient();
const app = express();

app.get("/stories", async (req: Request, res: Response) => {
    let user_name = req.query.user_name;
    if (!user_name) return badQueryParams(res, "user_name");
    await responseLogic(res, getStories(ig, String(user_name)));
});

app.get("/profile", async (req: Request, res: Response) => {
    let user_name = req.query.user_name;
    if (!user_name) return badQueryParams(res, "user_name");
    await responseLogic(res, getProfileInfo(ig, String(user_name)));
});

app.get("/post", async (req: Request, res: Response) => {
    let photo_cache = req.query.photo_cache;
    if (!photo_cache) return badQueryParams(res, "photo_cache");
    await responseLogic(res, getPostInfo(String(photo_cache)));
});

app.listen(config.port, async () => {
    console.log("Connect to instagram");
    console.time("Connection time");
    await login(ig, config.userName, config.password);
    console.log("Ready");
    console.timeEnd("Connection time");
});