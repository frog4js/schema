import { readdirSync, statSync } from "fs";

import * as path from "path";

function findTestFiles(dir, ext) {
    const files = readdirSync(dir, { withFileTypes: true });
    let testFiles = [];

    for (const file of files) {
        const filePath = path.join(dir, file.name);
        const stats = statSync(filePath);

        if (stats.isDirectory()) {
            testFiles = [...testFiles, ...findTestFiles(filePath, ext)];
        } else if (file.isFile() && file.name.endsWith(ext)) {
            testFiles.push(filePath);
        }
    }

    return testFiles;
}

const testFiles = findTestFiles(path.join(process.cwd(), "./test"), ".test.js");
const srcFiles = findTestFiles(path.join(process.cwd(), "./src"), ".js");
for (const file of srcFiles) {
    import(file);
}
for (const file of testFiles) {
    import(file);
}
