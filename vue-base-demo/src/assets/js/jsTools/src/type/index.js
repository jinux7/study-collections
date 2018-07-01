/**
 * @description 判断类型
 * 
 */

 // 如果object是一个数组，返回true。
 const type_isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};


// 如果object是一个Function，返回true。
const type_isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
};


// 如果object是一个对象，返回true。[排除数组和函数]
const type_isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};


// 如果object是一个字符串，返回true。
const type_isString = function(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
};


// 如果object是一个数值，返回true (包括 NaN)。
const type_isNumber = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
};


// 如果object是一个布尔值，返回true。
const type_isBoolean = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Boolean]';
};


// 如果object是一个Date类型，返回true。
const type_isDate = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
};


// 如果object的值是 null、undefined或者空，返回true。
const type_isNull = function(value) {
    return value === '' || value === undefined || value === null ? true : false;
};

/**
 * 如果object 不包含任何值，返回true。 对于字符串和数组对象，如果length属性为0，那么返回true。
 *
 * var a = {} => _.isEmpty(a) === true
 * var a = '' => _.isEmpty(a) === true
 * var a = [] => _.isEmpty(a) === true
 *
 */
const type_isEmpty = function(obj) {
    let flag = true;

    if (type_isArray(obj) || btype_isString(obj)) {
        flag = obj.length === 0 ? true : false;
    }

    if (type_isObject(obj)) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                flag = false;
            }
        }
    }

    return flag;
};


// 验证日期格式[yyyy-mm-dd]
const type_isDateFormat = function(text) {
    var reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
    return reg.test(text.toString());
};


// 验证邮箱
const type_isEmail = function(text) {
    var reg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
    return reg.test(text);
};


// 验证ip
const type_isIP = function(text) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/;
    return reg.test(text);
};


// 验证url
const type_isURL = function(text) {
    var reg = /[a-zA-z]+:\/\/[^\s]/;
    return reg.test(text);
};
export {
        type_isArray,
        type_isFunction,
        type_isObject,
        type_isString,
        type_isNumber,
        type_isBoolean,
        Format,
        type_isNull,
        type_isEmpty,
        type_isDateFormat,
        type_isEmail,
        type_isIP,
        type_isURL
    }