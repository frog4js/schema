export const keys = {
    $ref: "$ref",

    $schema: "$schema",
    id: "id",

    type: "type",
    schema: "schema",
    default: "default",
    optional: "optional",
    properties: "properties",
    items: "items",
    additionalProperties: "additionalProperties",
    requires: "requires",
    minimum: "minimum",
    maximum: "maximum",
    minimumCanEqual: "minimumCanEqual",
    maximumCanEqual: "maximumCanEqual",
    minItems: "minItems",
    maxItems: "maxItems",
    format: "format",
    pattern: "pattern",
    maxLength: "maxLength",
    minLength: "minLength",
    enum: "enum",
    title: "title",
    description: "description",
    maxDecimal: "maxDecimal",
    disallow: "disallow",
    divisibleBy: "divisibleBy",
    uniqueItems: "uniqueItems",
    extends: "extends",
    required: "required",
    exclusiveMinimum: "exclusiveMinimum",
    exclusiveMaximum: "exclusiveMaximum",
    dependencies: "dependencies",
    additionalItems: "additionalItems",
    patternProperties: "patternProperties",
    oneOf: "oneOf",
    anyOf: "anyOf",
    allOf: "allOf",
    not: "not",
    minProperties: "minProperties",
    maxProperties: "maxProperties",
    multipleOf: "multipleOf",
};
export const ticks = {
    nextExecute: 1,
    nextMatch: 2,
    endExecute: 99,
};
export const pathKeys = {
    ref: -100,
};
export const errorCodes = {
    // additionalProperties
    additionalPropertiesMustNotHaveAdditionalProperties: "must not have additional properties",

    // default
    defaultMustComplyWithSchema: "must comply with schema",

    // enum
    enumMustBeEqualToOneOfTheEnumValues: "must be equal to one of the enum values",

    // format
    formatMustMatchTheDefinitionOfFormat: "must match the definition of format",

    // maxDecimal
    maxDecimalMustBeLessThanOrEqualToLimit: "must be less than or equal to limit",

    // maximum
    maximumMustBeLessThanLimit: "must be less than limit",
    maximumMustBeLessThanOrEqualToLimit: "must be less than or equal to limit",

    // minimum
    minimumMustBeLessThanLimit: "must be greater than limit",
    minimumMustBeLessThanOrEqualToLimit: "must be greater than or equal to limit",

    // maxItems
    maxItemsMustBeGreaterThanOrEqualToLimit: "must be greater than or equal to limit",

    // minItems
    minItemsMustBeLessThanOrEqualToLimit: "must be less than or equal to limit",

    // maxLength
    maxLengthMustBeGreaterThanOrEqualToLimit: "must be greater than or equal to limit",

    // minLength
    minLengthMustBeLessThanOrEqualToLimit: "must be less than or equal to limit",

    // optional
    optionalMustBeExists: "must be exists",

    // pattern
    patternMustMatchPattern: "must match pattern",

    // disallow
    disallowMustNotBeDisallowType: "must not be disallow type",

    // type
    typeMustBeOfTheType: "must be of the type",

    // divisibleBy
    divisibleByMustBeDivisible: "must be divisible",

    // require
    requiredMustBeExists: "must be exists",

    // dependencies
    dependenciesMustBeTheRightDependency: "must be the right dependency",

    // additionalItems
    additionalItemsMustNotHaveMoreItems: "must not have more items",

    // oneOf
    oneOfMustMatchExactlyOneSchemaInOneOf: "must match exactly one schema in oneOf",

    // anyOf
    anyOfMustMatchASchemaInAnyOf: "must match a schema in anyOf",

    // allOf
    allOfMustMatchSchemasInAllOf: "must match schemas in allOf",

    // not
    notMustNotBeValid: "must NOT be valid",
    // minProperties
    minPropertiesMustBeLessThanOrEqualToLimit: "must be less than or equal to limit",
    // maxProperties
    maxPropertiesMustBeGreaterThanOrEqualToLimit: "must be greater than or equal to limit",
    multipleOfMustBeDivisible: "must be divisible",
};
