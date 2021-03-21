function success(result){
    return {
        status: "success",
        result: result
    }
}

function error(result){
    return {
        status: "error",
        result: result
    }
}

exports.success = success;
exports.error = error;