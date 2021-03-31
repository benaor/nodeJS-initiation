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

exports.isErr = (err) => {
    return err instanceof Error; 
}

exports.checkAndChange = (obj) => {
    if (this.isErr(obj)) return this.error(obj.message);
    else return this.success(obj); 
}

exports.success = success;
exports.error = error;
