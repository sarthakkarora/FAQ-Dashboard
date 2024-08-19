const User = require('../models/usermodel');
const bcrypt = require('bcrypt'); 

const checkAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('Email:', email); 
        console.log('Password:', password); 

        const user = await User.findOne({ email: email });
        console.log('User:', user); 

        if (!user || user.isAdmin === false) { 
            console.log('Not authorized: user not found or not admin');
            return res.status(401).send('Not authorized');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch); 

        if (!isMatch) {
            console.log('Invalid credentials: password does not match');
            return res.status(401).send('Invalid credentials');
        }

        console.log('Password correct, user is admin');
        req.user = user; 
        next();
    } catch (err) {
        console.error('Server error:', err); 
        res.status(500).send('Server error');
    }
};

module.exports = checkAdmin;
