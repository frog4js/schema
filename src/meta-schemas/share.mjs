import draft01 from "./draft-01/schema.mjs";
import draft02 from "./draft-02/schema.mjs";
import draft03 from "./draft-03/schema.mjs";
import draft04 from "./draft-04/schema.mjs";
import draft05 from "./draft-05/schema.mjs";
import draft06 from "./draft-06/schema.mjs";
import draft07 from "./draft-07/schema.mjs";
import { versionConstant } from "../constants/share.mjs";
export default {
    [versionConstant.jsonSchemaVersions.draft01]: [draft01],
    [versionConstant.jsonSchemaVersions.draft02]: [draft02],
    [versionConstant.jsonSchemaVersions.draft03]: [draft03],
    [versionConstant.jsonSchemaVersions.draft04]: [draft04],
    [versionConstant.jsonSchemaVersions.draft05]: [draft05],
    [versionConstant.jsonSchemaVersions.draft06]: [draft06],
    [versionConstant.jsonSchemaVersions.draft07]: [draft07],
};
