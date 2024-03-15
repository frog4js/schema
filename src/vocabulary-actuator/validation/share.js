import $refConfigs from "./$ref.js";
import optionalConfigs from "./optional.js";
import requiresConfigs from "./requires.js";
import defaultConfigs from "./default.js";
import typeConfigs from "./type.js";
import propertiesConfigs from "./properties.js";
import itemsConfig from "./items.js";
import additionalPropertiesConfigs from "./additionalProperties.js";
import minimumConfigs from "./minimum.js";
import maximumConfigs from "./maximum.js";
import minItemsConfigs from "./minItems.js";
import maxItemsConfigs from "./maxItems.js";
import formatConfigs from "./format.js";
import patternConfigs from "./pattern.js";
import maxLengthConfigs from "./maxLength.js";
import minLengthConfigs from "./minLength.js";
import enumConfigs from "./enum.js";
import maxDecimalConfigs from "./maxDecimal.js";
import disallowConfigs from "./disallow.js";
import divisibleByConfigs from "./divisibleBy.js";
import uniqueItemsConfigs from "./uniqueItems.js";
import requiredConfigs from "./required.js";
import dependenciesConfigs from "./dependencies.js";
import additionalItemsConfigs from "./additionalItems.js";
import patternPropertiesConfigs from "./patternProperties.js";
import anyOfConfigs from "./anyOf.js";
import oneOfConfigs from "./oneOf.js";
import allOfConfigs from "./allOf.js";
import notConfigs from "./not.js";
import minPropertiesConfigs from "./minProperties.js";
import maxPropertiesConfigs from "./maxProperties.js";
import multipleOfConfigs from "./multipleOf.js";
import constConfigs from "./const.js";
import propertyNamesConfigs from "./propertyNames.js";
import containsConfigs from "./contains.js";
import exclusiveMaximumConfigs from "./exclusiveMaximum.js";
import exclusiveMinimumConfigs from "./exclusiveMinimum.js";
import ifConfigs from "./if.js";
import thenConfigs from "./then.js";
import elseConfigs from "./else.js";
import contentEncodingConfigs from "./contentEncoding.js";
import contentMediaTypeConfigs from "./contentMediaType.js";
export default [
    ...$refConfigs,
    ...optionalConfigs,
    ...requiresConfigs,
    ...defaultConfigs,
    ...typeConfigs,
    ...propertiesConfigs,
    ...additionalPropertiesConfigs,
    ...itemsConfig,
    ...minimumConfigs,
    ...maximumConfigs,
    ...minItemsConfigs,
    ...maxItemsConfigs,
    ...formatConfigs,
    ...patternConfigs,
    ...maxLengthConfigs,
    ...minLengthConfigs,
    ...enumConfigs,
    ...maxDecimalConfigs,
    ...disallowConfigs,
    ...divisibleByConfigs,
    ...uniqueItemsConfigs,
    ...requiredConfigs,
    ...dependenciesConfigs,
    ...additionalItemsConfigs,
    ...patternPropertiesConfigs,
    ...allOfConfigs,
    ...anyOfConfigs,
    ...oneOfConfigs,
    ...notConfigs,
    ...minPropertiesConfigs,
    ...maxPropertiesConfigs,
    ...multipleOfConfigs,
    ...constConfigs,
    ...propertyNamesConfigs,
    ...containsConfigs,
    ...exclusiveMinimumConfigs,
    ...exclusiveMaximumConfigs,
    ...ifConfigs,
    ...thenConfigs,
    ...elseConfigs,
    ...contentEncodingConfigs,
    ...contentMediaTypeConfigs,
].sort((item1, item2) => item1.index - item2.index);
