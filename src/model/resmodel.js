class baicModel {
    constructor(data, message) {
        if (typeof(data) === 'string') {
            this.message = data;
            data = null;
            message = null;
        }
        if (data) {
            this.data = data;
        }
        if (message) {
            this.message = message;
        }
    }
}

class SuccessModel extends baicModel {
    constructor(data, message) {
        super(data, message);
        this.errnum = 1;
    }
}

class ErrorModel extends baicModel {
    constructor(data, message) {
        super(data, message) 
        this.errnum = 0;
    }
}

module.exports = {
    ErrorModel,
    SuccessModel
}