import { before, describe, it } from "node:test";
import { contextManage } from "../src/context/share.mjs";
import { schemaManage } from "../src/schema/share.mjs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { vocabularyActuatorManage } from "../src/vocabulary-actuator/share.mjs";
import * as assert from "assert";

const __filename = fileURLToPath(import.meta.url);

function loadJSON(filePath) {
    const file = fs.readFileSync(filePath, "utf8");
    return JSON.parse(file);
}

function loadJSONRecursive(directoryPath, fileTree) {
    function traverseDir(currentPath, currentFileTree) {
        const files = fs.readdirSync(currentPath);

        files.forEach((file) => {
            const filePath = path.join(currentPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                currentFileTree[file] = {};
                traverseDir(filePath, currentFileTree[file]);
            } else if (stat.isFile() && path.extname(file) === ".json") {
                currentFileTree[file] = loadJSON(filePath);
            }
        });
    }

    traverseDir(directoryPath, fileTree);
}

function eachFile(treeJson, parentPath, callback) {
    const isFileRe = /\.json$/;
    for (let name of Object.keys(treeJson)) {
        if (isFileRe.test(name)) {
            callback(parentPath + name, treeJson[name]);
        } else {
            eachFile(treeJson[name], parentPath + name + "/", callback);
        }
    }
}

/**
 *
 * @param {{suiteAbsolutePath: string, drafts: Array<string>, skipPaths?: Array<string>, skipTestDescriptions?: Array<string>}}configs
 */
export default function jsonSchemaTest(configs) {
    const testJson = {};
    const remoterJson = {};
    loadJSONRecursive(path.join(configs.suiteAbsolutePath, "./tests"), testJson);
    loadJSONRecursive(path.join(configs.suiteAbsolutePath, "./remotes"), remoterJson);

    const draftMap = {
        draft3: "http://json-schema.org/draft-03/schema#",
        draft4: "http://json-schema.org/draft-04/schema#",
        draft6: "http://json-schema.org/draft-06/schema#",
        draft7: "http://json-schema.org/draft-07/schema#",
    };
    const idKeyMap = {
        draft3: "id",
        draft4: "id",
        draft5: "id",
        draft6: "$id",
        draft7: "$id",
    };
    const remoterFilePaths = {
        draft3: [/^\/integer\.json$/, /^\/subSchemas\.json$/],
        draft4: [
            /^\/integer\.json$/,
            /^\/subSchemas\.json$/,
            /^\/locationIndependentIdentifierDraft4\.json$/,
            /^\/nested\.json$/,
            /^\/baseUriChange\/folderInteger\.json$/,
            /^\/baseUriChangeFolder\/folderInteger\.json$/,
            /^\/baseUriChangeFolderInSubschema\/folderInteger\.json$/,
            /^\/name.json$/,
        ],
        draft6: [
            /^\/integer\.json$/,
            /^\/subSchemas\.json$/,
            /^\/locationIndependentIdentifierDraft4\.json$/,
            /^\/nested\.json$/,
            /^\/baseUriChange\/folderInteger\.json$/,
            /^\/baseUriChangeFolder\/folderInteger\.json$/,
            /^\/baseUriChangeFolderInSubschema\/folderInteger\.json$/,
            /^\/name\.json$/,
            /^\/draft6\/detached-ref\.json$/,
            /^\/ref-and-definitions\.json$/,
            /^\/locationIndependentIdentifierPre2019\.json$/,
            /^\/locationIndependentIdentifier\.json$/,
            /^\/nested\/foo-ref-string\.json$/,
            /^\/nested\/string\.json$/,
        ],
        draft7: [
            /^\/integer\.json$/,
            /^\/subSchemas\.json$/,
            /^\/locationIndependentIdentifierDraft4\.json$/,
            /^\/nested\.json$/,
            /^\/baseUriChange\/folderInteger\.json$/,
            /^\/baseUriChangeFolder\/folderInteger\.json$/,
            /^\/baseUriChangeFolderInSubschema\/folderInteger\.json$/,
            /^\/name\.json$/,
            /^\/draft7\/detached-ref\.json$/,
            /^\/draft7\/ignore-dependentRequired\.json$/,
            /^\/ref-and-definitions\.json$/,
            /^\/locationIndependentIdentifierPre2019\.json$/,
            /^\/locationIndependentIdentifier\.json$/,
            /^\/nested\/foo-ref-string\.json$/,
            /^\/nested\/string\.json$/,
        ].map((x) => new RegExp(x)),
    };
    configs.drafts.forEach((draft) => {
        describe(draft, () => {
            eachFile(testJson[draft], "/", (fileName, suiteList) => {
                suiteList.forEach((suiteItem) => {
                    describe(suiteItem.description, { skip: configs.skipPaths?.includes(fileName) }, () => {
                        let context;
                        before(() => {
                            context = contextManage.create({
                                $schema: draftMap[draft],
                                baseURI: "http://localhost:1234/",
                                strict: false,
                            });
                            try {
                                eachFile(remoterJson, "/", (path, schema) => {
                                    if (remoterFilePaths[draft].some((re) => re.test(path))) {
                                        if (!schema[idKeyMap[draft]]) {
                                            schema[idKeyMap[draft]] = path;
                                        }
                                        try {
                                            schemaManage.addReferenceSchema(context, schema);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }
                                });
                                schemaManage.setMainSchema(context, suiteItem.schema);
                                schemaManage.compile(context);
                            } catch (e) {
                                console.log(e);
                            }
                        });
                        suiteItem.tests.forEach((test) => {
                            it(
                                test.description,
                                { skip: configs.skipTestDescriptions?.includes(test.description) },
                                () => {
                                    const { valid, errors } = vocabularyActuatorManage.validate(context, test.data);
                                    if (valid !== test.valid) {
                                        console.error(
                                            test.description,
                                            JSON.stringify(suiteItem.schema),
                                            JSON.stringify(test.data),
                                            errors,
                                        );
                                    }
                                    assert.equal(valid, test.valid);
                                },
                            );
                        });
                    });
                });
            });
        });
    });
}

jsonSchemaTest({
    suiteAbsolutePath: path.join(__filename, "../src"),
    drafts: ["draft4", "draft6"],
    skipPaths: ["/optional/zeroTerminatedFloats.json", "/optional/cross-draft.json"],
    skipTestDescriptions: ["none of the properties mentioned"],
});

//
// path.join(__filename, "../tests")
//
//
// const draftList = ["draft3"];
// draftList.forEach(draft => {
//     if (tests[draft]) {
//
//         for (const fileName of Object.keys(tests[draft])) {
//             // tests[draft][fileName]
//         }
//         console.log(tests[draft])
//     }
// })
// for (let i =0; i<10; i++) {
//
// }
// describe("test JSON Schema Test suite", () => {
//     describe("draft-03", () => {
//
//     });
//
//     it("draft-03", () => {
//         console.log(tests)
//         const context = contextManage.create({
//             baseURI: "http://localhost:1234/",
//             $schema: "http://json-schema.org/draft-04/schema#"
//         });
//         // schemaManage.setMainSchema()
//     })
// })
