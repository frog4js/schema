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

/*
 * @param {string} paramId
 * @param {string} baseUrl
 */
export function calculateId(paramId, baseUrl) {
    try {
        const url = new URL(paramId, baseUrl);
        return url.origin + url.pathname + "#";
    } catch (e) {
        return false;
    }

    // let url;
    // try {
    //     url = new URL(paramId);
    // }catch (e) {
    //     try {
    //         url = new URL(baseUrl + "/" + encodeURIComponent(paramId));
    //     }catch (e1) {
    //
    //     }
    // }
    // if (!url) {
    //     return false;
    // }
    // return `${url.protocol}//${url.host}${url.pathname}${vocabularyActuatorConstant.pathKeys.self}`;
}
/*
 * @param {string} paramId
 * @param {string} baseUrl
 * @return {false | {id: string, pointer: string}}
 */
export function calculateIdAndPointer(uriReference, baseUrl) {
    try {
        const url = new URL(uriReference, baseUrl);
        return {
            id: url.origin + url.pathname + "#",
            pointer: url.hash === "" ? "#" : url.hash,
        };
    } catch (e) {
        return false;
    }
}
