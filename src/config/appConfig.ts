// appConfig.ts

import * as fs from 'fs';
import * as path from 'path';

const configPath = path.join(__dirname,'../..', 'config.json');
const rawConfig = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(rawConfig);

export const mysqlConfig = config.mysqlConfig;
export const mailgunConfig = config.mailgunConfig;
export const cacheConfig = config.cacheConfig;

// import { mailgunConfig } from '../appConfig';
// console.log(`Sending email to ${to} using Mailgun with API key: ${mailgunConfig.apiKey}`);