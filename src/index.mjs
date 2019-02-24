/**
 * @param {Object} target
 * @param {Object} source
 * @param {boolean} overwriteNonIterable
 * @return {Object}
 */
export default function deepMerge(target, source, overwriteNonIterable = true) {
    if (target === source) {
        return target;
    }

    if (!isPlainObject(target) || !isPlainObject(source)) {
        throw new Error('Target and source must be a plain objects');
    }

    for (const key of Object.keys(source)) {
        if (!Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = source[key];
        } else {
            if (!isPlainObject(target[key])) {
                // Array, string, number, function, regexp, ...
                if (overwriteNonIterable) {
                    if (Array.isArray(target[key]) && Array.isArray(source[key])) {
                        target[key] = target[key].concat(source[key]);
                    } else {
                        target[key] = source[key];
                    }
                } else {
                    target[key] = (Array.isArray(target[key]) ? target[key] : [target[key]])
                        .concat(Array.isArray(source[key]) ? source[key] : [source[key]]);
                }
            } else {
                // Plain: {...}
                // If source[key] is not a plain object, an error will be thrown on recursive merge() call
                target[key] = deepMerge(target[key], source[key]);
            }
        }
    }

    return target;
}

/**
 * @param {*} x
 * @return {boolean}
 */
function isPlainObject(x) {
    if (Object.prototype.toString.call(x) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(x);
    return prototype === null || prototype === Object.getPrototypeOf({});
}
