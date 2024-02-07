import optionalConfigs from "./optional.mjs";
import requiresConfigs from "./requires.mjs";
import defaultConfigs from "./default.mjs";
import typeConfigs from "./type.mjs";
import propertiesConfigs from "./properties.mjs";
import itemsConfig from "./items.mjs";
import additionalPropertiesConfigs from "./additionalProperties.mjs";
import minimumConfigs from "./minimum.mjs";
import maximumConfigs from "./maximum.mjs";
import minItemsConfigs from "./minItems.mjs";
import maxItemsConfigs from "./maxItems.mjs";
import formatConfigs from "./format.mjs";
import patternConfigs from "./pattern.mjs";
import maxLengthConfigs from "./maxLength.mjs";
import minLengthConfigs from "./minLength.mjs";
import enumConfigs from "./enum.mjs";
import maxDecimalConfigs from "./maxDecimal.mjs";
import disallowConfigs from "./disallow.mjs";
import divisibleByConfigs from "./divisibleBy.mjs";
import uniqueItemsConfigs from "./uniqueItems.mjs";
import requiredConfigs from "./required.mjs";
import dependenciesConfigs from "./dependencies.mjs";
import additionalItemsConfigs from "./additionalItems.mjs";
import patternPropertiesConfigs from "./patternProperties.mjs";
import anyOfConfigs from "./anyOf.mjs";
import oneOfConfigs from "./oneOf.mjs";
import allOfConfigs from "./allOf.mjs";
import notConfigs from "./not.mjs";
import minPropertiesConfigs from "./minProperties.mjs";
import maxPropertiesConfigs from "./maxProperties.mjs";
import multipleOfConfigs from "./multipleOf.mjs";
export default [
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
].sort((item1, item2) => item1.index - item2.index);
