import open from 'open';
import { Event } from './types';
import { IncomingMessage, ServerResponse, createServer, Server } from 'http';
import { UserManagerSettings } from 'oidc-client';
import { ChildProcess } from 'child_process';
import { appSettings } from '.';

export class ConsolePopupWindow {
    private thePromise: Promise<Event | string>;
    private resolve: ((value?: Event | string) => void) | undefined;
    private reject: ((value?: Error) => void) | undefined;
    public features?: string;
    public target?: string;
    public redirectUri: string;
    private windowHandle?: ChildProcess;
    private server?: Server;
    private port = appSettings.port ?? 5000;

    constructor(params: { redirectUrl: string }) {
        this.thePromise = new Promise((resolve: (value?: Event | string) => void, reject: (value?: Error) => void) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        this.redirectUri = params.redirectUrl;
    }

    public async startService(): Promise<void> {
        this.server = createServer({}, (req: IncomingMessage, res: ServerResponse) => {
            if (this.isValidCodeFlowUri(req.url)) {
                this.onCompleteCallback({ url: req.url });
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end('<html><body><h2>You may close this page now</h2></body></html>');
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end('<html><body><h2>Invalid redirect url</h2></body></html>');
                this.error('Invalid redirect url');
            }
        });
        this.server.listen(this.port);
    }

    public async navigate(params: UserManagerSettings & { url: string }): Promise<string | Event> {
        if (!params || !params.url) {
            this.error('No url provided');
        }

        this.startService();
        this.windowHandle = await open(params.url);

        return this.thePromise;
    }

    private success(data?: Event) {
        this.cleanup();
        if (this.resolve) this.resolve(data);
    }

    private error(message: string) {
        this.cleanup();
        if (this.reject) this.reject(new Error(message));
    }

    public close(): void {
        this.cleanup();
    }

    public onCompleteCallback(event?: Event): void {
        this.success({ url: event?.url });
    }

    private cleanup(): void {
        this.windowHandle?.kill();
        this.server?.close();
    }

    public isValidCodeFlowUri(url?: string): boolean {
        const { code, session_state, state } = this.parseUrlFragment(url ?? '', '?');
        return !!code && !!state;
    }

    private parseUrlFragment(value: string, delimiter = '#'): { [key: string]: string } {
        const idx = value.lastIndexOf(delimiter);
        if (idx >= 0) {
            value = value.substr(idx + 1);
        }

        const params: { [key: string]: string } = {};
        const regex = /([^&=]+)=([^&]*)/g;
        let match = regex.exec(value);

        while (match) {
            params[decodeURIComponent(match[1])] = decodeURIComponent(match[2].replace(/\+/g, ' '));
            match = regex.exec(value);
        }

        return params;
    }
}
