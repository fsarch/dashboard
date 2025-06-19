import * as fs from 'node:fs/promises';
import path from "node:path";
import {writeFile} from "node:fs/promises";

const baseDir = './src/app/(with-header)/function/[serviceId]/function/[functionId]/_components/editor-types';

const files = await fs.readdir(`${baseDir}/services`);

const items = [];
const serviceMap = {};

for (let file of files) {
    if (!file.endsWith('.d.ts')) {
        continue;
    }

    console.log(file);
    const content = await fs.readFile(path.resolve(baseDir, 'services', file), 'utf-8');
    const lines = content.split('\n');

    const firstLine = lines[0];
    const matchedFirstLine = firstLine.match(/^\/\/ service: ([A-Za-z0-9-_]+)/);
    if (!matchedFirstLine) {
        throw new Error(`invalid service interface file (wrong service line at ${file}): ${firstLine}`);
    }

    const secondLine = lines[1];
    const matchedSecondLine = secondLine.match(/^\/\/ interface: ([A-Za-z0-9-_]+)/);
    if (!matchedSecondLine) {
        throw new Error(`invalid service interface file (wrong interface line at ${file}): ${secondLine}`);
    }

    items.push({
        content,
        filePath: file,
    });

    serviceMap[matchedFirstLine[1]] = matchedSecondLine[1];
}

await writeFile(path.resolve(baseDir, 'definitions.generated.ts'), `/*
 * AUTO-GENERATED FILE, DO NOT EDIT
 */
export const API_EXTRA_LIBS = ${JSON.stringify(items)};
export const API_SERVICES = ${JSON.stringify(serviceMap)};
`);
