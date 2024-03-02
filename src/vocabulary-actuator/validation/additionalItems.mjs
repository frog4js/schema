import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { typeUtil } from "../../util/share.mjs";

function isSubSchemaResolve(context, { startSubSchemaExecute }) {
    const parentSchemaInfo = contextManage.getSiblingSchemaRefData(context, vocabularyActuatorConstant.keys.items);
    const items = parentSchemaInfo.$ref[parentSchemaInfo.key];
    if (typeUtil.getTypeofType(items) === typeConstant.typeofTypes.array) {
        const instanceCount = context.instanceData.current.$ref[context.instanceData.current.key].length;
        for (let moreItemIndex = items.length; moreItemIndex < instanceCount; moreItemIndex++) {
            contextManage.enterContext(context, undefined, moreItemIndex);
            startSubSchemaExecute(context, false);
            contextManage.backContext(context, undefined, moreItemIndex);
        }
    }
    return vocabularyActuatorConstant.ticks.nextExecute;
}
/**
 * @typedef import("../../types/share")
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.additionalItems,
        versions: [
            versionConstant.jsonSchemaVersions.draft03,
            versionConstant.jsonSchemaVersions.draft04,
            versionConstant.jsonSchemaVersions.draft05,
        ],
        index: 7,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        const parentSchemaInfo = contextManage.getSiblingSchemaRefData(
                            context,
                            vocabularyActuatorConstant.keys.items,
                        );
                        const items = parentSchemaInfo.$ref[parentSchemaInfo.key];
                        if (
                            typeUtil.getTypeofType(items) === typeConstant.typeofTypes.array &&
                            context.instanceData.current.$ref[context.instanceData.current.key].length > items.length
                        ) {
                            errorManage.pushError(context);
                        }
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: isSubSchemaResolve,
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.additionalItems,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: 7.1,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: isSubSchemaResolve,
            },
        ],
    },
];
export default configs;
