const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/usermodel');

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); 
        res.json(users);
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
});
router.post('/users', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        let isAdmin;

        if(req.body.code == 1){
            isAdmin = true;
        } else {
            isAdmin = false;
        }

        const user = new User({ 
            name: req.body.name, 
            email: req.body.email, 
            password: hashedPassword,
            isAdmin: isAdmin 
        });

        console.log('User object to save:', user);
        
        await user.save();
        res.status(201).send('User created');
    } catch (err) {
        console.error('Error:', err);
        res.status(400).send('Error creating user');
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            // Determine userType based on isAdmin value
            const userType = user.isAdmin ? 'Admin' : 'User';
            
            // Send JSON response with message and userType
            return res.json({ message: 'Success', userType: userType });
        } else {
            return res.status(401).send('Not Allowed');
        }
    } catch (err) {
        return res.status(500).send('Error logging in');
    }
});


router.post('/users/delete', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            await User.deleteOne({ email: req.body.email });
            res.send('User deleted successfully');
        } else {
            res.status(400).send('Incorrect password');
        }
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});

router.post('/users/update-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (isMatch) {
            const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
            user.password = newHashedPassword;
            await user.save();
            res.send('Password updated successfully');
        } else {
            res.status(400).send('Incorrect current password');
        }
    } catch (err) {
        res.status(500).send('Error updating password');
    }
});

module.exports = router;
