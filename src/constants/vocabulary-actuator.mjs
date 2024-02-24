export const keys = {
    $ref: "$ref",

    $schema: "$schema",
    id: "id",
    definitions: "definitions",

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
    self: "#",
};
export const defaultErrorMessages = {
    [keys.additionalProperties]: {
        "zh-cn": "不能有额外的属性",
        "en-gb": "must not have additional properties",
    },
    [keys.default]: {
        "zh-cn": "默认值验证失败",
        "en-gb": "must comply with schema",
    },
    [keys.enum]: {
        "zh-cn": "必须是指定的枚举值",
        "en-gb": "must be equal to one of the enum values",
    },
    [keys.format]: {
        "zh-cn": "必须匹配定义的格式",
        "en-gb": "must match the definition of format",
    },
    [keys.maxDecimal]: {
        "zh-cn": "必须小于或等于限制的值",
        "en-gb": "must be less than or equal to limit",
    },
    [keys.maximum]: {
        "zh-cn": "必须小于限制的值",
        "en-gb": "must be less than or equal to limit",
    },
    [keys.minimum]: {
        "zh-cn": "必须大于限制的值",
        "en-gb": "must be greater than limit",
    },
    [keys.maxItems]: {
        "zh-cn": "必须小于限制的值",
        "en-gb": "must be greater than or equal to limit",
    },
    [keys.minItems]: {
        "zh-cn": "必须大于限制的值",
        "en-gb": "must be less than or equal to limit",
    },
    [keys.maxLength]: {
        "zh-cn": "必须小于限制的值",
        "en-gb": "must be greater than or equal to limit",
    },
    [keys.minLength]: {
        "zh-cn": "必须大于限制的值",
        "en-gb": "must be less than or equal to limit",
    },
    [keys.optional]: {
        "zh-cn": "必须是存在的值",
        "en-gb": "must be exists",
    },
    [keys.pattern]: {
        "zh-cn": "必须匹配模式",
        "en-gb": "must match pattern",
    },
    [keys.disallow]: {
        "zh-cn": "不能是禁止的值",
        "en-gb": "must not be disallow type",
    },
    [keys.disallow]: {
        "zh-cn": "不能是禁止的值",
        "en-gb": "must not be disallow type",
    },
    [keys.type]: {
        "zh-cn": "必须是指定的类型",
        "en-gb": "must be of the type",
    },
    [keys.divisibleBy]: {
        "zh-cn": "必须被整除",
        "en-gb": "must be divisible",
    },
    [keys.required]: {
        "zh-cn": "必须是存在的值",
        "en-gb": "must be exists",
    },
    [keys.dependencies]: {
        "zh-cn": "必须是正确依赖",
        "en-gb": "must be the right dependency",
    },
    [keys.additionalItems]: {
        "zh-cn": "不允许有更多的值",
        "en-gb": "must not have more items",
    },
    [keys.oneOf]: {
        "zh-cn": "必须严格匹配定义中一个约束",
        "en-gb": "must match exactly one schema in oneOf",
    },
    [keys.anyOf]: {
        "zh-cn": "必须匹配定义其中一个约束",
        "en-gb": "must match a schema in anyOf",
    },
    [keys.allOf]: {
        "zh-cn": "必须匹配定义中所有约束",
        "en-gb": "must match schemas in allOf",
    },
    [keys.not]: {
        "zh-cn": "必须是无效的",
        "en-gb": "must not be valid",
    },
    [keys.maxProperties]: {
        "zh-cn": "必须小于限制的值",
        "en-gb": "must be greater than or equal to limit",
    },
    [keys.minProperties]: {
        "zh-cn": "必须大于限制的值",
        "en-gb": "must be less than or equal to limit",
    },
    [keys.multipleOf]: {
        "zh-cn": "必须被整除",
        "en-gb": "must be divisible",
    },
};
export const flags = {
    isSchema: "_$frog4js_is_schema",
};
