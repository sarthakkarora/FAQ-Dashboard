const express = require("express");
const Query = require('../models/query');
const checkAdmin = require('../middlewares/checkAdmin');
const User = require('../models/usermodel');
const router = express.Router();

router.post('/queries', async (req, res) => {
    try {
        const email = req.body.email;
        console.log(req.body);

        // Verifying the user
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('User not found');
            return res.status(400).send('Email not found. Please register first.');
        }
        console.log('User verified');

       
        const newQuery = new Query({
            email: req.body.email,
            title: req.body.title,
            body: req.body.body,
            status: 'pending',
            createdAt: new Date()
        });
        console.log('Query object created:', newQuery);

        // Try-catch around the save operation
        try {
            await newQuery.save();
            console.log('Query saved successfully');
            res.status(201).send('Query submitted and awaiting approval.');
        } catch (saveError) {
            console.error('Error saving query:', saveError);
            res.status(500).send('Error saving query');
        }
    } catch (err) {
        console.error('Error in request handling:', err);
        res.status(500).send('Error submitting query');
    }
});

router.get('/pending-queries', checkAdmin, async (req, res) => {
    try {
        const queries = await Query.find({status:'pending'});
        console.log(queries)
        res.status(200).json(queries);
    } catch (err) {
        res.status(500).send('Error fetching queries');
    }
});

router.get('/approved-queries', checkAdmin, async (req, res) => {
    try {
        const queries = await Query.find({status:'approved'});
        console.log(queries)
        res.status(200).json(queries);
    } catch (err) {
        res.status(500).send('Error fetching queries');
    }
});

router.get('/rejected-queries', checkAdmin, async (req, res) => {
    try {
        const queries = await Query.find({status:'rejected'});
        console.log(queries)
        res.status(200).json(queries);
    } catch (err) {
        res.status(500).send('Error fetching queries');
    }
});

router.put('/approve-query/:id', checkAdmin, async (req, res) => {
    try {
        const { approve } = req.body; 
        console.log(approve);
        const query = await Query.findById(req.params.id);
        console.log(query);
        
        if (!query) {
            return res.status(404).send('Query not found');
        }

        query.status = "approved"; 
        await query.save();

        res.status(200).send(`Query ${approve ? 'approved' : 'disapproved'} successfully`);
    } catch (err) {
        res.status(500).send('Server error');
    }
});


module.exports = router;
