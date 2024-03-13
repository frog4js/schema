/**
 *
 * @typedef import("../types/share")
 */
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
const TIME = /^(\d\d):(\d\d):(\d\d)(\.\d{0,6})?(z|[+-]\d\d(?::?\d\d)?)?$/i;
const DATE_TIME_SEPARATOR = /t|\s/i;
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const OFFSET = /([+-])(\d{2}):(\d{2})/;
const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

/**
 *
 * @param {Array<number>}array
 * @param {number}index
 * @return {boolean}
 */
function isLeapYear(array, index) {
    return array[index] % 4 === 0 && (array[index] % 100 !== 0 || array[index] % 400 === 0);
}

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
        validate: (refData) => {
            const dateTime = refData.$ref[refData.key].split(DATE_TIME_SEPARATOR);
            return (
                dateTime.length === 2 &&
                draftFormats["date"].validate({
                    $ref: dateTime,
                    key: 0,
                }) &&
                draftFormats["time"].validate({
                    $ref: dateTime,
                    key: 1,
                })
            );
        },
    },
    // date - This should be a date in the format of YYYY-MM-DD. It is recommended that you use the "date-time" format instead of "date" unless you need to transfer only the date part.
    date: {
        validate: (refData) => {
            let matches = refData.$ref[refData.key].match(DATE);
            if (!matches) return false;
            // [other,year, month, day]
            matches = matches.map((item, i) => (i > 0 ? +item : item));

            return (
                matches[2] >= 1 &&
                matches[2] <= 12 &&
                matches[3] >= 1 &&
                matches[3] <= (matches[2] === 2 && isLeapYear(matches, 1) ? 29 : DAYS[matches[2]])
            );
        },
    },
    // time - This should be a time in the format of hh:mm:ss. It is recommended that you use the "date-time" format instead of "time" unless you need to transfer only the time part.
    time: {
        validate: (refData) => {
            let matches = refData.$ref[refData.key].match(TIME);
            if (!matches || !matches[5]) return false;
            if (!(matches[1] <= 23 && matches[2] <= 59)) {
                return false;
            }
            matches = matches.map((item, i) => (i > 0 && i <= 3 ? +item : item));
            if (matches[5] && matches[5] !== "z" && matches[5] !== "Z") {
                const offsets = matches[5].match(OFFSET)?.map((item, i) => (i >= 2 && i <= 3 ? +item : item));
                if (!offsets) return false;
                if (offsets[2] > 12 || offsets[3] >= 60) {
                    return false;
                }
                if (offsets[1] === "-") {
                    matches[2] = matches[2] + offsets[3];
                    if (matches[2] > 60) {
                        matches[1] = matches[1] + offsets[2] + 1;
                    } else {
                        matches[1] = matches[1] + offsets[2];
                    }
                    if (matches[1] > 23) {
                        matches[1] = 0;
                    }
                } else {
                    if (matches[2] < offsets[3]) {
                        if (matches[1] === 0) {
                            matches[1] = 23;
                        } else {
                            matches[1] = matches[1] - 1;
                        }
                        matches[2] = matches[2] + 60 - offsets[3];
                    } else {
                        matches[2] = matches[2] - offsets[3];
                    }
                    if (matches[1] < offsets[2]) {
                        matches[1] = matches[1] + 24 - offsets[2];
                    } else {
                        matches[1] = matches[1] - offsets[2];
                    }
                    if (matches[1] === 24) matches[1] = 0;
                }
            }
            // [other, hour, minute, second, ".", "timeZone"]
            return (
                (matches[1] <= 23 && matches[2] <= 59 && matches[3] <= 59) ||
                (matches[1] === 23 && matches[2] === 59 && matches[3] === 60)
            );
        },
    },
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
    ipv4: {
        validate: (refData) => {
            if (!IPV4.test(refData.$ref[refData.key])) {
                return false;
            }
            return refData.$ref[refData.key].split(".").every((x) => !(x.length > 1 && x[0] === "0"));
        },
    },
    "ip-address": {
        validate: (refData) => {
            if (!IPV4.test(refData.$ref[refData.key])) {
                return false;
            }
            return refData.$ref[refData.key].split(".").every((x) => !(x.length > 1 && x[0] === "0"));
        },
    },
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
    "relative-json-pointer": {
        regex: /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
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
        if (context.defaultConfig.strict === false) {
            result = true;
        }
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
