import { vocabularyActuatorConstant, typeConstant, versionConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { urlUtil } from "../../util/share.mjs";
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
                    const paths = [...context.instancePaths];
                    paths.pop();
                    paths.pop();
                    /**
                     * @type {string}
                     */
                    let parentId;
                    while (true) {
                        parentId = contextManage.getCache(context, vocabularyActuatorConstant.keys.$id, paths);
                        if (parentId) {
                            break;
                        }
                        if (paths.length === 0) {
                            break;
                        }
                        paths.pop();
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
