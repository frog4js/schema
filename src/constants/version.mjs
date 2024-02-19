export const jsonSchemaVersions = {
    draft01: 1,
    draft02: 2,
    draft03: 3,
    draft04: 4,
};
export const jsonSchemaVersionGroups = {
    all: Object.values(jsonSchemaVersions),
    lastVersions: [jsonSchemaVersions.draft04],
    draft02ByAdd: Object.values(jsonSchemaVersions).filter((x) => x >= jsonSchemaVersions.draft02),
    draft03ByAdd: Object.values(jsonSchemaVersions).filter((x) => x >= jsonSchemaVersions.draft03),
    draft04ByAdd: Object.values(jsonSchemaVersions).filter((x) => x >= jsonSchemaVersions.draft04),
};
export const jsonSchema$schemaVersionMap = {
    "http://json-schema.org/draft-01/schema#": jsonSchemaVersions.draft01,
    "http://json-schema.org/draft-02/schema#": jsonSchemaVersions.draft02,
    "http://json-schema.org/draft-03/schema#": jsonSchemaVersions.draft03,
    "http://json-schema.org/draft-04/schema#": jsonSchemaVersions.draft04,
};
export const jsonSchema$schemaDraftMap = {
    [jsonSchemaVersions.draft01]: "http://json-schema.org/draft-01/schema#",
    [jsonSchemaVersions.draft02]: "http://json-schema.org/draft-02/schema#",
    [jsonSchemaVersions.draft03]: "http://json-schema.org/draft-03/schema#",
    [jsonSchemaVersions.draft04]: "http://json-schema.org/draft-04/schema#",
};
