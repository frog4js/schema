export const jsonSchemaVersions = {
    draft01: 1,
    draft02: 2,
};
export const jsonSchemaVersionGroups = {
    all: Object.values(jsonSchemaVersions),
    lastVersions: [2],
    draft02ByAdd: Object.values(jsonSchemaVersions).filter((x) => x >= jsonSchemaVersions.draft02),
};
export const jsonSchema$schemaVersionMap = {
    "http://json-schema.org/draft-01/hyper-schema#": 1,
    "http://json-schema.org/draft-02/hyper-schema#": 2,
};
