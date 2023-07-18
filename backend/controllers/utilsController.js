const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.isNullOrWhitespace = (input) => {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
};
exports.validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
exports.encryptString = async (input) => {
    if (!this.isNullOrWhitespace(input)) {
        const hashedString = await bcrypt.hash(input, 10);
        return hashedString;
    } else {
        throw new Error('La cadena de entrada es nula o está vacía.');
    }
};

exports.generateAuthToken = (userId) => {
    const token = jwt.sign({ id: userId }, 'your_jwt_secret', { expiresIn: '1h' }); // Remember to replace 'your_jwt_secret' with your own secret
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 1);  // The token expires in 1 hour
    return { token, expires_at };
};
exports.compareString = async (password, hashedPassword) => {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch(err) {
      console.log(err);
      return false;
    }
  };
  
