import * as process from "process";


const config = {
    userName: process.env.user_name || "None",
    password: process.env.password || "None",
    port: process.env.port || 8080,
    redis_url: process.env.redis_url || "redis://localhost:6379",
};

export default config;