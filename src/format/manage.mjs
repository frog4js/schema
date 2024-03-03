/**
 *
 * @typedef import("../types/share")
 */

/**
 *
 * @type {Formats}
 */
const builtInFormats = {
    "json-schema-system-base-URI": {
        validate: (refData) => {
            try {
                const url = new URL(refData.$ref[refData.key]);
                return (
                    url.pathname[url.pathname.length - 1] === "/" &&
                    `${url.origin}${url.pathname}` === refData.$ref[refData.key]
                );
            } catch (e) {
                return false;
            }
        },
    },
};
/**
 *
 * @type {Formats}
 */
const draftFormats = {
    // date-time - This should be a date in ISO 8601 format of YYYY-MM-DDThh:mm:ssZ in UTC time. This is the recommended form of date/timestamp.
    "date-time": {
        regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?([+-]([01]\d|2[0-3]):[0-5]\d|Z)$/,
    },
    // date - This should be a date in the format of YYYY-MM-DD. It is recommended that you use the "date-time" format instead of "date" unless you need to transfer only the date part.
    date: { regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/ },
    // time - This should be a time in the format of hh:mm:ss. It is recommended that you use the "date-time" format instead of "time" unless you need to transfer only the time part.
    time: { regex: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ },
    // utc-millisec - This should be the difference, measured in milliseconds, between the specified time and midnight, January 1, 1970 UTC. The value should be a number (integer or float).
    "utc-millisec": { regex: /^\d+$/ },
    // regex - A regular expression.
    regex: {
        validate: (refData) => {
            try {
                new RegExp(refData.$ref[refData.key]);
                return true;
            } catch (e) {
                return false;
            }
        },
    },
    //  color - This is a CSS color (like "#FF0000" or "red").
    color: { regex: /^.*/ },
    // style - This is a CSS style definition (like "color: red; background-color:#FFF").
    style: { regex: /^.*/ },
    // phone - This should be a phone number (format may follow E.123).
    phone: { regex: /^\+(?:[0-9]{1,3}(?:[- ]?)){6,14}[0-9]+$/ },
    // uri - This value should be a URI..
    uri: {
        regexes: [
            /\/|:/,
            /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
        ],
    },
    // email - This should be an email address.
    email: {
        regex: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    },
    // ip-address - This should be an ip version 4 address.  替换为ip-address
    ipv4: { regex: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/ },
    "ip-address": { regex: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/ },
    //     ipv6 - This should be an ip version 6 address.
    ipv6: {
        regex: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    },
    // street-address - This should be a street address.
    "street-address": { regex: /^.*/ },
    // locality - This should be a city or town.
    locality: { regex: /^.*/ },
    // region - This should be a region (a state in the US, province in Canada, etc.)
    region: { regex: /^.*/ },
    // postal-code - This should be a postal code (AKA zip code).
    "postal-code": { regex: /^.*/ },
    // country - This should be the name of a country.
    country: { regex: /^.*/ },
    "uri-reference": { regex: /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i },
    hostname: {
        regex: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    },
    "host-name": {
        regex: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    },
    "uri-template": {
        regex: /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    },
    "json-pointer": {
        regex: /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    },
};

/**
 *
 * @param {Context} context
 * @return {boolean}
 */
export function validate(context) {
    let result = false;
    const formatDefinition = getFormatDefinition(context, context.schemaData.current);
    if (formatDefinition === false) {
        return result;
    }
    if (formatDefinition.regex) {
        result = formatDefinition.regex.test(context.instanceData.current.$ref[context.instanceData.current.key]);
    } else if (formatDefinition.validate) {
        result = formatDefinition.validate(context.instanceData.current);
    } else if (formatDefinition.regexes) {
        result = formatDefinition.regexes.every((regex) =>
            regex.test(context.instanceData.current.$ref[context.instanceData.current.key]),
        );
    }
    return result;
}

/**
 *
 * @param {Context} context
 * @param {RefData} refData
 * @param {Array<string>} [keysByVersion]
 * @return {boolean | FormatDefinition}
 */
export function getFormatDefinition(context, refData, keysByVersion) {
    if (keysByVersion && !keysByVersion.includes(refData.$ref[refData.key])) {
        return false;
    }
    let valid = builtInFormats[refData.$ref[refData.key]];
    if (!valid) {
        valid = draftFormats[refData.$ref[refData.key]];
    }
    if (!valid) {
        return false;
    }
    return valid;
}
