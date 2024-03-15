export default {
    $schema: "http://json-schema.org/draft-01/hyper-schema#",
    id: "http://json-schema.org/draft-01/schema#",
    type: "object",
    properties: {
        type: {
            type: ["string", "array"],
            items: {
                type: ["string", { $ref: "#" }],
            },
            optional: true,
            default: "any",
        },

        properties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            optional: true,
            default: {},
        },

        items: {
            type: [{ $ref: "#" }, "array"],
            items: { $ref: "#" },
            optional: true,
            default: {},
        },

        optional: {
            type: "boolean",
            optional: true,
            default: false,
        },

        additionalProperties: {
            type: [{ $ref: "#" }, "boolean"],
            optional: true,
            default: {},
        },

        requires: {
            type: ["string", { $ref: "#" }],
            optional: true,
        },

        minimum: {
            type: "number",
            optional: true,
        },

        maximum: {
            type: "number",
            optional: true,
        },

        minimumCanEqual: {
            type: "boolean",
            optional: true,
            requires: "minimum",
            default: true,
        },

        maximumCanEqual: {
            type: "boolean",
            optional: true,
            requires: "maximum",
            default: true,
        },

        minItems: {
            type: "integer",
            optional: true,
            minimum: 0,
            default: 0,
        },

        maxItems: {
            type: "integer",
            optional: true,
            minimum: 0,
        },

        pattern: {
            type: "string",
            optional: true,
            format: "regex",
        },

        minLength: {
            type: "integer",
            optional: true,
            minimum: 0,
            default: 0,
        },

        maxLength: {
            type: "integer",
            optional: true,
        },

        enum: {
            type: "array",
            optional: true,
            minItems: 1,
        },

        title: {
            type: "string",
            optional: true,
        },

        description: {
            type: "string",
            optional: true,
        },

        format: {
            type: "string",
            optional: true,
        },

        contentEncoding: {
            type: "string",
            optional: true,
        },

        default: {
            type: "any",
            optional: true,
        },

        maxDecimal: {
            type: "integer",
            optional: true,
            minimum: 0,
        },

        disallow: {
            type: ["string", "array"],
            items: { type: "string" },
            optional: true,
        },

        extends: {
            type: [{ $ref: "#" }, "array"],
            items: { $ref: "#" },
            optional: true,
            default: {},
        },
    },
    optional: true,
    default: {},
};
