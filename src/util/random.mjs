/**
 * Generates a random string with the specified length.
 *
 * @param {number} [length=8] - The length of the generated string, default is 8
 * @param {string} [characters='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'] - The characters to use for generating the string, default is all alphanumeric characters
 * @returns {string} The generated random string
 */
export function getPseudoRandomString(
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
