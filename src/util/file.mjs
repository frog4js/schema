import { readdirSync, statSync } from "fs";

import * as path from "path";
export function findFiles(dir, ext) {
    const files = readdirSync(dir, { withFileTypes: true });
    let allFiles = [];

    for (const file of files) {
        const filePath = path.join(dir, file.name);
        const stats = statSync(filePath);

        if (stats.isDirectory()) {
            allFiles = [...allFiles, ...findFiles(filePath, ext)];
        } else if (file.isFile() && file.name.endsWith(ext)) {
            allFiles.push(filePath);
        }
    }

    return allFiles;
}
