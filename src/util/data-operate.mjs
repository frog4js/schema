/**
 *
 * @param {*} data
 */
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
