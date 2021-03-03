function arrayToObjectHeaders(headers_as_array) {
    if (!(headers_as_array instanceof Array)) {
        throw "Parameter isn't an array";
    } else {
        let headers_obj = {};
        for (let i = 0; i < headers_as_array.length; i += 2) {
            headers_obj[headers_as_array[i]] = headers_as_array[i + 1];
        }
        return headers_obj;
    }
}

function checkForBasicHeaders(headers_obj) {
    if(!(typeof headers_obj == "object")){
        throw "Parameter isn't an object"
    } else {
        let bad_headers = {
            "User-Agent": ""
        }
        for(const [header, value] of Object.entries(bad_headers)){
            if(!headers_obj.hasOwnProperty(header))return false;
            if(headers_obj[header] == value)return false;
        }
        return true;
    }
}

module.exports = {
    checkForBasicHeaders,
    arrayToObjectHeaders
}