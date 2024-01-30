import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

const formats = {
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
    regex: { func: regex },
    //  color - This is a CSS color (like "#FF0000" or "red").
    color: { regex: /^.*/ },
    // style - This is a CSS style definition (like "color: red; background-color:#FFF").
    style: { regex: /^.*/ },
    // phone - This should be a phone number (format may follow E.123).
    phone: { regex: /^\+(?:[0-9]{1,3}(?:[- ]?)){6,14}[0-9]+$/ },
    // uri - This value should be a URI..
    uri: {
        regexs: [
            /\/|:/,
            /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
        ],
    },
    // email - This should be an email address.
    email: {
        regex: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    },
    // ip-address - This should be an ip version 4 address.
    ipv4: { regex: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/ },
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
};

function regex(str) {
    try {
        new RegExp(str);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.format,
        version: versionConstant.jsonSchemaVersion.all,
        index: 12,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    const valid = formats[context.schemaData.current.$ref[context.schemaData.current.key]];
                    if (!valid) {
                        return executeConstant.ticks.nextExecute;
                    }
                    let result = true;
                    if (valid.regex) {
                        result = valid.regex.test(context.instanceData.current.$ref[context.instanceData.current.key]);
                    } else if (valid.func) {
                        result = valid.func(context.instanceData.current.$ref[context.instanceData.current.key]);
                    } else if (valid.regexs) {
                        result = valid.regexs.every((regex) =>
                            regex.test(context.instanceData.current.$ref[context.instanceData.current.key]),
                        );
                    }
                    if (!result) {
                        pushError(context, "formatMustMatchTheDefinitionOfFormat", 1);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
