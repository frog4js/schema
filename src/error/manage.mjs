function getErrorLength(context) {
    return context.errors.length;
}
function hasError(context) {
    return getErrorLength(context) === 0;
}
export { getErrorLength, hasError };
