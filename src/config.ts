import * as process from "process";

const config = {
    userName: process.env.user_name || "riopro2812",
    password: process.env.password || "kik0kik1235",
    port: process.env.port || 8080,
    redis_url: process.env.redis_url || "redis://localhost:6379",
};

export default config;