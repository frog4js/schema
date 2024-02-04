export const keys = {
    type: "type",
    schema: "schema",
    default: "default",
    optional: "optional",
    properties: "properties",
    items: "items",
    $ref: "$ref",
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
    divisibleByMustNotHaveDuplicateItems: "must not have duplicate items",

    // require
    requiredMustBeExists: "must be exists",

    // dependencies
    dependenciesMustBeTheRightDependency: "must be the right dependency",

    // additionalItems
    additionalItemsMustNotHaveMoreItems: "must not have more items",
};
