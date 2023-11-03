import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/Mandatory';

const createUser = async (username, email, password) => {
    try {
        const user = {
            username,
            email,
            password,
            role: "user"
        }
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('Mandatory');
        const collection = db.collection('users');

        const result = await collection.insertOne(user);
        console.log('User created successfully');
        return result;
    } catch (err) {
        console.error('Error occurred while creating user', err);
        throw err;
    }
};

const findUserByUsername = async (username) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('Mandatory');
        const collection = db.collection('users');

        const result = await collection.findOne({ username });
        console.log('User found:', result);
        return result;
    } catch (err) {
        console.error('Error occurred while finding user', err);
        throw err;
    }
};

const findAllUsers = async () => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('Mandatory');
        const collection = db.collection('users');

        const result = await collection.find().toArray();
        console.log('All users:', result);
        return result;
    } catch (err) {
        console.error('Error occurred while finding all users', err);
        throw err;
    }
};

const createAdminUser = async () => {
    try {
        const user = {
            username: "admin",
            email: "admin@admin",
            password: "$2b$10$y1DuVu3DhYTXLSXjK2k2Mukv/AMdTd.W2lhWC38xMPd3A8ScoPyDy",
            role: "admin"
        }
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db('Mandatory');
        const collection = db.collection('users');

        const result = await collection.insertOne(user);
        console.log('User created successfully');
        return result;
    } catch (err) {
        console.error('Error occurred while creating user', err);
        throw err;
    }
};

export { createUser, findUserByUsername, findAllUsers, createAdminUser };