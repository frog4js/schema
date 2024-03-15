import { pushError, mergeError } from "./manage.js";
import { SchemaInvalidError } from "./schema-invalid-error.js";
import { DefaultConfigError } from "./default-config-error.js";
import { SystemError } from "./system-error.js";
export const errorManage = { pushError, mergeError };
export const errorClass = {
    DefaultConfigError,
    SchemaInvalidError,
    SystemError,
};
