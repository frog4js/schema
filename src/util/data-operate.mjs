/**
 *
 * @param {*} data
 */
import { typeUtil } from "./share.mjs";
import { typeConstant } from "../constants/share.mjs";

export function clone(data) {
    if (data === null) {
        return data;
    }
    if (typeof data !== "object") {
        return data;
    }
    if (Array.isArray(data)) {
        return [...data];
    }
    return Object.assign({}, data);
}

export function deepClone(data) {
    const cloneItem = (item) => {
        if (item === null || item === undefined) {
            return item;
        }
        if (typeof item !== "object") {
            return item;
        }
        if (Array.isArray(item)) {
            return item.map((subItem) => cloneItem(subItem));
        }
        const newObj = {};
        for (const key of Object.keys(item)) {
            newObj[key] = cloneItem(item[key]);
        }
        return newObj;
    };

    return cloneItem(data);
}

/**
 *
 * @param {*} data
 * @param {number} depth
 */
export function toString(data, depth = 2) {
    let curDepth = 0;
    const toStringItem = (item) => {
        curDepth++;
        if (item === null) {
            return "null";
        }
        if (item === undefined) {
            return undefined;
        }
        switch (typeof item) {
            case "function":
            case "symbol":
                return undefined;
            case "bigint":
            case "string":
                return `"${item.toString()}"`;
            case "boolean":
            case "number":
                return item;
        }

        if (Array.isArray(item)) {
            if (curDepth > depth) {
                return "Array";
            }
            return (
                "[ " +
                item
                    .map((subItem) => {
                        const v = toStringItem(subItem);
                        curDepth--;
                        return v;
                    })
                    .join(", ") +
                " ]"
            );
        }
        if (curDepth > depth) {
            return "Object";
        }
        const newObjectArray = [];
        for (const key of Object.keys(item)) {
            const v = toStringItem(item[key]);
            if (v) {
                newObjectArray.push(`"${key}": ${v}`);
            }
            curDepth--;
        }
        return "{ " + newObjectArray.join(", ") + " }";
    };
    const v = toStringItem(data);
    if (v === undefined) {
        return "";
    } else if (typeof v !== "string") {
        return `${v}`;
    }
    return v;
}

/**
 *
 * @param {array}array
 * @param {*}value
 * @return {boolean}
 */
export function fastDeepIncludes(array, value) {
    for (const item of array) {
        if (fastDeepEqual(item, value)) {
            return true;
        }
    }
    return false;
}

/**
 *
 * @param {*}data1
 * @param {*}data2
 * @return {boolean}
 */
export function fastDeepEqual(data1, data2) {
    if (data1 === data2) {
        return true;
    }
    const type1 = typeUtil.getTypeofType(data1);
    const type2 = typeUtil.getTypeofType(data2);
    if (type1 !== type2) {
        return false;
    }
    if (type1 === typeConstant.typeofTypes.object) {
        const keys1 = Object.keys(data1);
        const keys2 = Object.keys(data2);
        if (!fastDeepEqual(keys1, keys2)) {
            return false;
        }
        for (const key of keys1) {
            if (!fastDeepEqual(data1[key], data2[key])) {
                return false;
            }
        }
        return true;
    } else if (type1 === typeConstant.typeofTypes.array) {
        if (data1.length !== data2.length) {
            return false;
        }
        for (let index = 0; index < data1.length; index++) {
            if (!fastDeepEqual(data1[index], data2[index])) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

export function fastDeepHasDuplicates(array) {
    if (!Array.isArray(array) || array.length <= 1) {
        return false;
    }
    const primitiveOrNullTypeItems = new Set();

    const objectTypeItems = new Set();
    const objectTypeItemKeys = new Set();

    const arrayTypeItems = new Set();
    let arrayMaxLength = 0;

    for (const item of array) {
        const type = typeUtil.getTypeofType(item);
        let set;
        if (typeConstant.typeofTypes.object === type) {
            set = objectTypeItems;
            Object.keys(item).forEach((k) => objectTypeItemKeys.add(k));
        } else if (typeConstant.typeofTypes.array === type) {
            set = arrayTypeItems;
            if (item.length > arrayMaxLength) {
                arrayMaxLength = item.length;
            }
        } else if (typeConstant.typeofTypes.function === type) {
            set = primitiveOrNullTypeItems;
        } else {
            set = primitiveOrNullTypeItems;
        }
        const afterSize = set.size;
        set.add(item);
        if (set.size === afterSize) {
            return true;
        }
    }

    {
        // object
        // [{a: 1, b: 2}, {a:1, b:1}]  true, false => false
        // [{a: 1, b: 1}, {a:1, b:1}]  true, true => false
        let objectHasDuplicate = null;
        for (let key of objectTypeItemKeys) {
            objectHasDuplicate = true;
            const objectValues = [];
            for (const obj of objectTypeItems) {
                objectValues.push(obj[key]);
            }
            if (!fastDeepHasDuplicates(objectValues)) {
                objectHasDuplicate = false;
                break;
            }
        }
        if (objectHasDuplicate === true) {
            return true;
        }
    }
    {
        // array
        // [[1, 2], [1, 2]]  true, false => false
        let arrayHasDuplicate = null;
        for (let index = 0; index < arrayMaxLength; index++) {
            arrayHasDuplicate = true;
            const arrayValues = [];
            for (const obj of arrayTypeItems) {
                arrayValues.push(obj[index]);
            }
            if (!fastDeepHasDuplicates(arrayValues)) {
                arrayHasDuplicate = false;
                break;
            }
        }
        if (arrayHasDuplicate === true) {
            return true;
        }
    }
    return false;
}

/**
 *
 * @param {Object} obj
 * @param {string}pointer
 * @return {*}
 */
export function getValueByJsonPointer(obj, pointer) {
    const parts = getPathsByJsonPointer(pointer);
    if (parts.length === 0) {
        return obj;
    }
    let current = obj;

    for (let part of parts) {
        if (current === null) {
            return null;
        }
        if (current === undefined) {
            return undefined;
        }
        if (typeof current !== typeConstant.typeofTypes.object) {
            return current;
        }
        current = current[part];
    }

    return current;
}

/**
 *
 * @param {string} pointer
 * @return {string[]}
 */
export function getPathsByJsonPointer(pointer) {
    const parts = pointer
        .substring(1)
        .split("/")
        .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
    if (parts[0] === "") {
        parts.shift();
    }
    return parts;
}

/**
 *
 * @param {string} ref
 */
export function getPathsByRef(ref) {
    const index = ref.indexOf("#");
    if (index === -1) {
        return [ref];
    }
    return [ref.substring(0, index + 1), ...getPathsByJsonPointer(ref.substring(index))];
}

export function merge(obj1, obj2) {
    const mergeItem = (item1, item2) => {
        if (item1 === null || item1 === undefined) {
            return item2;
        }
        if (item2 === null || item2 === undefined) {
            return item1;
        }
        if (typeof item2 !== "object" || typeof item2 !== "object") {
            return item2;
        }
        if (Array.isArray(item1) && !Array.isArray(item2)) {
            return item2;
        } else if (!Array.isArray(item1) && Array.isArray(item2)) {
            return item2;
        } else if (Array.isArray(item1) && Array.isArray(item2)) {
            for (let index = 0; index < item2.length; index++) {
                item1[index] = mergeItem(item1[index], item2[index]);
            }
            return item1;
        } else {
            for (const key of Object.keys(item2)) {
                item1[key] = mergeItem(item1[key], item2[key]);
            }
            return item1;
        }
    };
    return mergeItem(obj1, obj2);
}

/**
 *
 *     // [1, 2, 3]  [1,2,3,4]  return 1
 *     // [1, 2, 3]  [1,2,3]  return 0
 *     // [1, 2, 3]  [1,2] return 2
 *     // [1, 2, 3]  [1,2, 4] return 3
 * @param {Array}array1
 * @param {Array}array2
 * @return {0 | 1 | 2 |3}
 */
export function compareToArray(array1, array2) {
    for (let i = 0; i < Math.max(array1.length, array2.length); i++) {
        if (array1[i] !== array2[i]) {
            if (i <= array1.length - 1 && i <= array2.length - 1) {
                return 3;
            } else if (i >= array1.length - 1 && i <= array2.length - 1) {
                return 1;
            } else {
                return 2;
            }
        }
    }
    return 0;
}
