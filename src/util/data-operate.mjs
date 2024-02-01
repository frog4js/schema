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
        if (item === null) {
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
