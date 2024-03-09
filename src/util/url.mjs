/**
 *
 * The "$id" keyword defines a URI for the schema, and the base URI that other URI references within the schema are resolved against. The "$id" keyword itself is resolved against the base URI that the object as a whole appears in.
 *
 * If present, the value for this keyword MUST be a string, and MUST represent a valid URI-reference [RFC3986]. This value SHOULD be normalized, and SHOULD NOT be an empty fragment <#> or an empty string <>.
 *
 * The root schema of a JSON Schema document SHOULD contain an "$id" keyword with a URI (containing a scheme). This URI SHOULD either not have a fragment, or have one that is an empty string. [CREF2]
 *
 * To name subschemas in a JSON Schema document, subschemas can use "$id" to give themselves a document-local identifier. This is done by setting "$id" to a URI reference consisting only of a fragment. The fragment identifier MUST begin with a letter ([A-Za-z]), followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), or periods (".").
 *
 * The effect of defining an "$id" that neither matches the above requirements nor is a valid JSON pointer is not defined.
 *
 *
 * {
 *     "$id": "http://example.com/root.json",
 *     "definitions": {
 *         "A": { "$id": "#foo" },
 *         "B": {
 *             "$id": "other.json",
 *             "definitions": {
 *                 "X": { "$id": "#bar" },
 *                 "Y": { "$id": "t/inner.json" }
 *             }
 *         },
 *         "C": {
 *             "$id": "urn:uuid:ee564b8a-7a87-4125-8c96-e9f123d6766f"
 *         }
 *     }
 * }
 *
 * For example:
 *
 * The schemas at the following URI-encoded JSON Pointers [RFC6901] (relative to the root schema) have the following base URIs, and are identifiable by either URI in accordance with Section 5 above:
 *
 * # (document root)
 * http://example.com/root.json#
 * #/definitions/A
 * http://example.com/root.json#foo
 * #/definitions/B
 * http://example.com/other.json
 * #/definitions/B/definitions/X
 * http://example.com/other.json#bar
 * #/definitions/B/definitions/Y
 * http://example.com/t/inner.json
 * #/definitions/C
 * urn:uuid:ee564b8a-7a87-4125-8c96-e9f123d6766f
 *
 */
const UUID_PROTOCOL = /^urn:uuid:/;
const STANDARD_PROTOCOL = /^(http|https|ftp|file):\/\//;
const COLON_SEPARATION = ":";
const SLASH_SEPARATION = "/";
const HASH = "#";
const QUESTION_MARK = "?";

/*
 * @param {string} paramId
 * @param {string} baseUrl
 */
export function calculateId(paramId, baseUrl) {
    const regexResult = [
        UUID_PROTOCOL.test(paramId),
        STANDARD_PROTOCOL.test(paramId),
        UUID_PROTOCOL.test(baseUrl),
        STANDARD_PROTOCOL.test(baseUrl),
    ];
    if (regexResult[0] || regexResult[1]) {
        return paramId;
    }
    if (regexResult[2]) {
        const index = baseUrl.indexOf(HASH);
        if (index === -1) {
            if (paramId[0] !== HASH) {
                return baseUrl + HASH + paramId;
            } else {
                return baseUrl + paramId;
            }
        } else {
            if (paramId[0] !== HASH) {
                return baseUrl.substring(0, index) + HASH + paramId;
            } else {
                return baseUrl.substring(0, index) + paramId;
            }
        }
    }
    if (regexResult[3]) {
        try {
            const url = new URL(paramId, baseUrl);
            return url.href;
        } catch (e) {
            return false;
        }
        // const thirdSlashIndex = baseUrl.indexOf(SLASH_SEPARATION, baseUrl.indexOf(SLASH_SEPARATION, baseUrl.indexOf(SLASH_SEPARATION) + 1) + 1);
        // const replace = (index) => {
        //     let url = baseUrl;
        //     if (index !== -1) {
        //         url = baseUrl.substring(0, index);
        //     }
        //     if (url[url.length -1] !== SLASH_SEPARATION) {
        //         return url + SLASH_SEPARATION + paramId;
        //     }
        //     return url + paramId;
        // }
        //
        // if (paramId[0] === HASH) {
        //     const index = baseUrl.indexOf(HASH);
        //     return replace(index);
        // }
        //
        // if (paramId[0] === QUESTION_MARK) {
        //     const index = baseUrl.indexOf(SLASH_SEPARATION);
        //     return replace(index);
        //
        // }
        // if (paramId[0] === SLASH_SEPARATION) {
        //     return replace(thirdSlashIndex);
        // }
        //
        // return baseUrl + SLASH_SEPARATION+ paramId;
    }
    return false;
}

/*
 * @param {string} paramId
 * @param {string} baseUrl
 * @return {false | {id: string, pointer: string}}
 */
export function calculateIdAndPointer(uriReference, baseUrl) {
    const regexResult = [
        UUID_PROTOCOL.test(uriReference),
        STANDARD_PROTOCOL.test(uriReference),
        UUID_PROTOCOL.test(baseUrl),
        STANDARD_PROTOCOL.test(baseUrl),
    ];
    if (regexResult[0]) {
        const index = uriReference.indexOf(HASH);
        if (index === -1) {
            return {
                id: uriReference.substring(0, index),
                pointer: HASH,
            };
        } else {
            return {
                id: uriReference.substring(0, index),
                pointer: uriReference.substring(index),
            };
        }
    }
    if (regexResult[2]) {
        const index = baseUrl.indexOf(HASH);
        if (index !== -1) {
            if (uriReference[0] !== HASH) {
                return {
                    id: uriReference,
                    pointer: HASH + uriReference,
                };
            } else {
                return {
                    id: uriReference,
                    pointer: uriReference,
                };
            }
        } else {
            if (uriReference[0] !== HASH) {
                return {
                    id: uriReference.substring(0, index),
                    pointer: HASH + uriReference,
                };
            } else {
                return {
                    id: uriReference.substring(0, index),
                    pointer: uriReference,
                };
            }
        }
    }
    if (regexResult[3]) {
        try {
            const url = new URL(uriReference, baseUrl);
            const index = url.hash.indexOf(SLASH_SEPARATION);
            const result = {
                id: `${url.protocol}${SLASH_SEPARATION}${SLASH_SEPARATION}${url.host}${url.pathname}`,
                pointer: HASH,
            };
            if (index !== -1) {
                result.pointer = HASH + url.hash.slice(index);
            }
            return result;
        } catch (e) {
            return false;
        }
    }
    return false;
}
