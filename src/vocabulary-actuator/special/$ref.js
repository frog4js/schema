import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";
import { urlUtil } from "../../util/share.js";
/**
 * @typedef {import("../../../types/share")}
 */
/**
 * @type {VocabularyActuatorConfig[]}
 */
export default [
    {
        key: vocabularyActuatorConstant.keys.$ref,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: -10,
        matches: [
            {
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    /**
                     * @type {string}
                     */
                    let parentId;
                    let level = 2;
                    let max = context.instancePaths.length;
                    while (true) {
                        parentId = contextManage.getCache(
                            context,
                            vocabularyActuatorConstant.keys.$id,
                            undefined,
                            level,
                        );
                        if (parentId) {
                            break;
                        }
                        if (level >= max) {
                            break;
                        }
                        level++;
                    }
                    if (!parentId) {
                        parentId = context.defaultConfig.baseURI;
                    }
                    let ref = context.instanceData.current.$ref[context.instanceData.current.key];
                    ref = urlUtil.calculateId(ref, parentId);
                    if (ref) {
                        context.instanceData.current.$ref[context.instanceData.current.key] = ref;
                        context.waitValidateRefs.push({
                            $ref: ref,
                            schema: context.instanceData.origin,
                        });
                    } else {
                        context.waitValidateRefs.push({
                            $ref: context.instanceData.current.$ref[context.instanceData.current.key],
                            schema: context.instanceData.origin,
                        });
                    }
                },
            },
        ],
    },
];
