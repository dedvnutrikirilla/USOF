module.exports =  function errorReplier(error, replyEntity) {
    switch(error.errCode){
        case 1001:
        case 1003:
        case 1004:
        case 1021:
        case 1022:
            replyEntity.status(400);
            break;
        case 1002:
        case 1005:
        case 1006:
            replyEntity.status(401);
            break;
        default:
            replyEntity.status(500);
            break;
    }
    replyEntity.send(error);
}
