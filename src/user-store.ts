import keytar from 'keytar';
import { StateStore, Logger } from 'oidc-client-ts';
import crypto from 'crypto';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import * as uuid from 'uuid';
import { appSettings } from '.';

export class UserStore implements StateStore {
    protected readonly _logger = new Logger("UserStore");
    
    readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
    readonly IV_LENGTH = 16; // For AES, this is always 16
    readonly account = appSettings.appName ?? 'oidc-client-ts-console';
    readonly appPath = path.join(os.homedir(), '.' + appSettings.appName);

    async remove(key: string): Promise<string | null> {
        try {
            const password = await keytar.getPassword(key, this.account);
            await fs.ensureDir(this.appPath);
            const encrypted = await fs.readFile(path.join(this.appPath, Buffer.from(key).toString('base64')), 'utf8');
            const decrypted = this.decrypt(encrypted, password);
            await keytar.deletePassword(key, this.account);
            return decrypted;
        } catch (ex) {
            this._logger.error('Failed to read user', ex);
            return null;
        }
    }
    async getAllKeys(): Promise<string[]> {
        return [];
    }
    public async get(key: string): Promise<string | null> {
        try {
            const password = await keytar.getPassword(key, this.account);
            await fs.ensureDir(this.appPath);
            const encrypted = await fs.readFile(path.join(this.appPath, Buffer.from(key).toString('base64')), 'utf8');
            const decrypted = this.decrypt(encrypted, password);
            return decrypted;
        } catch  {
            this._logger.info(`User credentials not found for account [${key}:${this.account}] at [${this.appPath}]`);
            return null;
        }
    }

    public async set(key: string, value: string): Promise<void> {
        await fs.ensureDir(this.appPath);
        const guid = uuid.v4();
        const encrypted = this.encrypt(value, guid);
        await fs.writeFile(path.join(this.appPath, Buffer.from(key).toString('base64')), encrypted);
        return keytar.setPassword(key, this.account, guid).catch((err) => {
            this._logger.error(`Failed to save to keytar: ${err} data length ${value.length}`);
        });
    }

    private encrypt(text: string, password: string): string {
        const iv = crypto.randomBytes(this.IV_LENGTH);
        const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    private decrypt(text: string, password: string | null): string {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift() as string, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
