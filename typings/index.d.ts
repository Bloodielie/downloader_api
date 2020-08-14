declare module 'tiktok-signature'{
    class Signer {
        public userAgent: string;
        public args: string[];
        public options: any;
        public browser?: any;
        public isExternalBrowser?: boolean ;
        public tac?: any;
        public context?: any;
        public page?: any;

        constructor(userAgent?: string, tac?: any, browser?: any);
        init(): Promise<this>;
        close(): Promise<void>;
        sign(str: string): Promise<string>;
        getVerifyFp(): Promise<string | null>;
    }
    export = Signer;
}