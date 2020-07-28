import { LaunchOptions, Browser, BrowserContext, Page } from "./playwright-webkit";

declare module 'tiktok-signature'{
    class Signer {
        public userAgent: string = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
        public args: string[] = [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-infobars",
            "--window-position=0,0",
            "--ignore-certifcate-errors",
            "--ignore-certifcate-errors-spki-list",
          ];
        public options: LaunchOptions = {
            args: [],
            ignoreDefaultArgs: ["--mute-audio", "--hide-scrollbars"],
            headless: true,
            ignoreHTTPSErrors: true,
          };
        public browser?: Browser;
        public isExternalBrowser?: boolean = true;
        public tac?: any;
        public context?: BrowserContext;
        public page?: Page;
        
        constructor(userAgent?: string, tac?: any, browser?: Browser);
        init(): Promise<this>;
        close(): Promise<void>;
        sign(str: string): Promise<string>;
        getVerifyFp(): Promise<string | null>;
    }
    export = Signer;
}