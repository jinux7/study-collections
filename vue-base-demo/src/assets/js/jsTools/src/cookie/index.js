/**
 * @description 对cookie的读写操作
 */

// 设置cookie
const cookie_set = function (name, value, expires, domain, path, secure) {
    var cookieText = "";
    cookieText += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if (expires instanceof Date) {
        cookieText += "; expires=" + expires.toGMTString();
    }
    if (path) {
        cookieText += "; path=" + path;
    }
    if (domain) {
        cookieText += "; domain=" + domain;
    }
    if (secure) {
        cookieText += "; secure";
    }			
    document.cookie = cookieText;
};
// 获取cookie
const cookie_get = function (name) {
    var cookieName = encodeURIComponent(name) + "=",
        cookieStart = document.cookie.indexOf(cookieName),
        cookieValue = "";
    if (cookieStart > -1) {
        var cookieEnd = document.cookie.indexOf (";", cookieStart);
        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue; 
};
// 删除cookie
const cookie_unset = function (name, domain, path, secure) {
    this.set(name, "", Date(0), domain, path, secure);
};

export {
    cookie_set,
    cookie_get,
    cookie_unset
    }

