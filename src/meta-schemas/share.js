import draft01 from "./draft-01/schema.js";
import draft02 from "./draft-02/schema.js";
import draft03 from "./draft-03/schema.js";
import draft04 from "./draft-04/schema.js";
import draft05 from "./draft-05/schema.js";
import draft06 from "./draft-06/schema.js";
import draft07 from "./draft-07/schema.js";
import { versionConstant } from "../constants/share.js";
export default {
    [versionConstant.jsonSchemaVersions.draft01]: [draft01],
    [versionConstant.jsonSchemaVersions.draft02]: [draft02],
    [versionConstant.jsonSchemaVersions.draft03]: [draft03],
    [versionConstant.jsonSchemaVersions.draft04]: [draft04],
    [versionConstant.jsonSchemaVersions.draft05]: [draft05],
    [versionConstant.jsonSchemaVersions.draft06]: [draft06],
    [versionConstant.jsonSchemaVersions.draft07]: [draft07],
};
