const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs');
const mykey = fs.readFileSync(__dirname + '/key.txt').toString();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization){
        res.status(401).send({
            errorMEssage: '로그인 후 사용하세요',
        });
        return;
    }
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요!',
        });
        return;
    }

    //jwt검증//
    try {
        const { userId } = jwt.verify(tokenValue, mykey);
        //검증 성공시 locals에 인증 정보 넣어주기//
        console.log(userId);
        User.findOne({ userId })
            .exec()
            .then((user) => {
                res.locals.user = user;
                next();
            });
    } catch (error) {
        res.status(401).send({
            errorMEssage: '로그인 하시고 사용하세요',
        });
        return;
    }
};