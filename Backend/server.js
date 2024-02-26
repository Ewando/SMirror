// node server.js

const os = require('os');
const express = require('express');
const cors = require('cors');
const app = express();
const Datastore = require('nedb');
const usersDB = new Datastore({ filename: './data/users.db', autoload: true });
const moduleConfigsDB = new Datastore({ filename: './data/moduleConfigs.db', autoload: true });
const bcrypt = require('bcrypt');

module.exports = usersDB;

app.use(express.json());
app.use(cors());

// Get the IP of the system

app.get('/getIP', (req, res) => {
    try {
        const networkInterfaces = os.networkInterfaces();
        const ip = networkInterfaces['wlan0'] ? networkInterfaces['wlan0'][0]['address'] : 'Interface not found';
        res.send({ ip });
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
});

// Sign up a user

app.post('/signup', async (req, res) => {

    const { email, password, firstName, lastName } = req.body;

    usersDB.findOne({ email }, async (err, user) => {
        if (err) {
            return res.status(500).send('Error accessing the database');
        }
        if (user) {
            return res.status(400).send('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        usersDB.insert({ email, password: hashedPassword, firstName, lastName }, (err, newUser) => {
            if (err) {
                return res.status(500).send('Error creating user');
            }
            res.status(201).send('User created successfully');
        });
    });
});

// Log a user in

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    usersDB.findOne({ email }, async (err, user) => {
        if (err) {
            return res.status(500).send('Error accessing the database');
        }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid credentials');
        }
        res.send('Login successful');
    });
});

// Get user via email  

app.get('/user', (req, res) => {
    const userEmail = req.query.email;

    if (!userEmail) {
        return res.status(400).send('Email parameter is required');
    }

    usersDB.findOne({ email: userEmail }, (err, user) => {
        if (err) {
            return res.status(500).send('Error accessing the database');
        }
        if (!user) {
            return res.status(404).send('User not found');
        }
     
        const { _id, firstName, lastName, email } = user;
        res.send({ _id, firstName, lastName, email });
    });
});

// Save module configs
app.post('/saveModuleConfig', async (req, res) => {
    const { userId, moduleConfig } = req.body;

    if (!userId || !moduleConfig.moduleId) {
        return res.status(400).send('Missing user ID or module configuration');
    }

    const query = { userId: userId, moduleId: moduleConfig.moduleId };
    const update = { $set: { config: moduleConfig.config } }; // Adjust based on your actual config structure

    moduleConfigsDB.findOne(query, (err, existingConfig) => {
        if (err) {
            return res.status(500).send('Error accessing the database');
        }

        if (existingConfig) {
            // Update existing config
            moduleConfigsDB.update(query, update, {}, (err) => {
                if (err) {
                    return res.status(500).send('Error updating configuration');
                }
                res.send('Configuration updated successfully');
            });
        } else {
            // Insert new config
            const newDoc = { ...query, config: moduleConfig.config }; // Combine query with config for new document
            moduleConfigsDB.insert(newDoc, (err, newConfig) => {
                if (err) {
                    return res.status(500).send('Error saving module configuration');
                }
                res.status(201).send('Configuration saved successfully');
            });
        }
    });
});


// Get module configs

app.get('/getModuleConfig/:userId', (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    moduleConfigsDB.find({ userId: userId }, (err, configs) => {
        if (err) {
            return res.status(500).send('Error accessing the database');
        }
        if (configs.length === 0) {
            return res.status(404).send('Configurations not found');
        }
        res.send(configs);
    });
});



const port = 3001;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
