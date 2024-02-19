import * as crypto from "node:crypto";

/**
 * Generates a random number within the specified range.
 *
 * @param {number} [lower=0] - The lower bound of the random number, default is 0
 * @param {number} [upper=1] - The upper bound of the random number, default is 1
 * @param {boolean} [floating=false] - Whether to generate a floating-point number, default is false
 * @returns {number} The generated random number
 */
function getPseudoRandomNumber(lower = 0, upper = 1, floating = false) {
    lower = +lower;
    upper = +upper;

    if (floating || upper % 1 !== 0 || lower % 1 !== 0) {
        const rand = Math.random();
        return Math.min(lower + rand * (upper - lower), upper);
    }
    return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

/**
 * Generates a true random number.
 *
 * @async
 * @param {number} [lower=0] - The lower bound of the generated random number (inclusive).
 * @param {number} [upper=1] - The upper bound of the generated random number (inclusive).
 * @param {boolean} [floating=false] - Whether to generate a floating-point number.
 * @return {Promise<number>} The generated true random number.
 */
async function getTrueRandomNumber(lower = 0, upper = 1, floating = false) {
    lower = +lower;
    upper = +upper;
    if (floating || upper % 1 !== 0 || lower % 1 !== 0) {
        const rand = (await syncRandomInt(0, 1000000)) / 1000000;
        return Math.min(lower + rand * (upper - lower), upper);
    }
    return await syncRandomInt(lower, upper + 1);
}

/**
 * Generates a random string with the specified length.
 *
 * @param {number} [length=8] - The length of the generated string, default is 8
 * @param {string} [characters='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'] - The characters to use for generating the string, default is all alphanumeric characters
 * @returns {string} The generated random string
 */
function getPseudoRandomString(
    length = 8,
    characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
) {
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Generates a true random string with the specified length.
 *
 * @async
 * @param {number} [size=12] - The length of the generated string, default is 8
 * @param {string} [characters='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'] - The characters to use for generating the string, default is all alphanumeric characters
 * @returns {Promise<string>} The generated true random string
 */
async function getTrueRandomString(
    size = 12,
    characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
) {
    let result = [];
    const charactersLength = characters.length;
    const mask = (2 << (31 - Math.clz32((charactersLength - 1) | 1))) - 1;
    const step = Math.ceil((1.6 * mask * size) / charactersLength);

    while (result.length < size) {
        const bytes = await syncRandomBuf(step);
        for (let i = 0; i < step && result.length < size; i++) {
            const charIndex = bytes[i] & mask;
            if (charIndex < charactersLength) {
                result.push(characters[charIndex]);
            }
        }
    }
    return result.join("");
}

/**
 * cryptographic pseudorandom number generator.
 * @return {UUID}
 */
function getUUID() {
    return crypto.randomUUID();
}
export { getPseudoRandomNumber, getTrueRandomNumber, getTrueRandomString, getPseudoRandomString, getUUID };

/**
 *
 * @param {number} min
 * @param {number} max
 * @return {Promise<number>}
 */
async function syncRandomInt(min, max) {
    return new Promise((resolve, reject) => {
        crypto.randomInt(min, max, (err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        });
    });
}

/**
 *
 * @param {number} size
 * @return {Promise<number>}
 */
async function syncRandomBuf(size) {
    return new Promise((resolve, reject) => {
        const buf = Buffer.alloc(size);
        crypto.randomFill(buf, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(buf);
            }
        });
    });
}
