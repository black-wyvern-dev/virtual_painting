let curIndex = 0;
let password = '12345678';

const setPassword = function(newPass) {
    password = newPass;
}

const getPassword = function() {
    return password;
}

module.exports = {curIndex, getPassword, setPassword};