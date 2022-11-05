module.exports = class UserErrors extends Error {
    constructor(errCode, additionalInfo, ...params) {
        super(...params);
        switch(errCode) {
            // VVV Auth/User errors (001 - 010) VVV
            case 1001:
                this.message = 'Login already exists';
                break;
            case 1002:
                this.message = 'Admin rights not found';
                break;
            case 1003:
                this.message = 'Login not found';
                break;
            case 1004:
                this.message = 'Passwords don\'t match';
                break;
            case 1005:
                this.message = 'Token screwed up';
                break;
            case 1006:
                this.message = 'You need to confirm your Email first';
                break;
            // VVV Unexpected errors (021 - 030) VVV
            case 1021:
                this.message = 'Unallowed symbols at ' + additionalInfo;
                break;
            case 1022:
                this.message = 'Object-table vlidator: incorrect field Len';
                break;
            case 1023:
                this.message = 'Crappy params';
                break;
            case 1024:
                this.message = 'You need to authorize first';
                break;
            case 1025:
                this.message = 'Request body not found';
                break;
            // VVV Posts errors (1031 - 1040) VVV
            case 1031:
                this.message = 'Bad Post parameters';
                break;
            // VVV Categories errors (1041 - 1050) VVV
            case 1041:
                this.message = 'Bad Category Id';
                break;
            // VVV Comments errors (1051 - 1060) VVV
            case 1051:
                this.message = 'Bad Comment Content';
                break;
            // VVV Comments errors (1061 - 1070) VVV
            case 1061:
                this.message = 'Bad Like Type';
                break;
            case 1062:
                // somehow unexpected error
                this.message = 'Like already exists, ty pidor, ksta';
                break;
            case 1063:
                this.message = 'Like not found';
                break;
            default:
                this.message = 'Object-table vlidator: undefined error!';
        }
        this.errCode = errCode;
    }
}