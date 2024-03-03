import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { jsonSchemaVersionGroups, jsonSchemaVersions } from "../../constants/version.mjs";
import { formatManage } from "../../format/share.mjs";
import { pushError } from "../../error/manage.mjs";
/**
 * @typedef {import("../../../types/share")}
 */

const v1Tov3FormatKeys = [
    "json-schema-system-base-URI",
    "date-time",
    "date",
    "time",
    "utc-millisec",
    "regex",
    "color",
    "style",
    "phone",
    "uri",
    "email",
    "ipv4",
    "ip-address",
    "ipv6",
    "street-address",
    "locality",
    "region",
    "postal-code",
    "country",
    "host-name",
];
const v4Tov5FormatKeys = [
    "json-schema-system-base-URI",
    "date-time",
    "email",
    "ipv4",
    "ipv6",
    "hostname",
    "uri",
    "uri-reference",
];
const v6FormatKeys = [
    "json-schema-system-base-URI",
    "date-time",
    "email",
    "ipv4",
    "ipv6",
    "hostname",
    "uri",
    "uri-reference",
    "uri-template",
    "json-pointer",
];
const v7FormatKeys = [
    "json-schema-system-base-URI",
    "date-time",
    "email",
    "ipv4",
    "ipv6",
    "hostname",
    "uri",
    "uri-reference",
    "uri-template",
    "json-pointer",
    "regex",
    "date",
    "time",
];

/**
 *
 * @param {Context}context
 * @param {Array<string>} [keysByVersion]
 */
function isValidFormat(context, keysByVersion) {
    const formatDefinition = formatManage.getFormatDefinition(context, context.instanceData.current, keysByVersion);
    if (formatDefinition === false && context.defaultConfig.strict === true) {
        pushError(context);
    }
}

/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: vocabularyActuatorConstant.keys.format,
        versions: [jsonSchemaVersions.draft01, jsonSchemaVersions.draft02, jsonSchemaVersions.draft03],
        index: -10.1,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    isValidFormat(context, v1Tov3FormatKeys);
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.format,
        versions: [jsonSchemaVersions.draft04, jsonSchemaVersions.draft05],
        index: -10.2,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    isValidFormat(context, v4Tov5FormatKeys);
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.format,
        versions: [jsonSchemaVersions.draft06],
        index: -10.3,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    isValidFormat(context, v6FormatKeys);
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.format,
        versions: jsonSchemaVersionGroups.draft07ByAdd,
        index: -10.4,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    isValidFormat(context, v7FormatKeys);
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
