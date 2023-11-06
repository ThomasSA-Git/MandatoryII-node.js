import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017/Mandatory";
let client;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
  }
};

const closeDatabaseConnection = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};

const createUser = async (username, email, password) => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("users");

    const user = {
      username,
      email,
      password,
      role: "user",
    };

    const result = await collection.insertOne(user);
    console.log("User created successfully");
    return result;
  } catch (err) {
    console.error("Error occurred while creating user", err);
    throw err;
  }
};

const findUserByUsername = async (username) => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("users");

    const result = await collection.findOne({ username });
    console.log("User found:", result);
    return result;
  } catch (err) {
    console.error("Error occurred while finding user", err);
    throw err;
  }
};

const findAllUsers = async () => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("users");

    const result = await collection.find().toArray();
    console.log("All users:", result);
    return result;
  } catch (err) {
    console.error("Error occurred while finding all users", err);
    throw err;
  }
};

const createAdminUser = async () => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("users");

    const user = {
      username: "admin",
      email: "admin@admin",
      password: "$2b$10$y1DuVu3DhYTXLSXjK2k2Mukv/AMdTd.W2lhWC38xMPd3A8ScoPyDy",
      role: "admin",
    };

    const result = await collection.insertOne(user);
    console.log("User created successfully");
    return result;
  } catch (err) {
    console.error("Error occurred while creating user", err);
    throw err;
  }
};

const updateUserPassword = async (username, newPassword) => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("users");

    const result = await collection.updateOne(
      { username },
      { $set: { password: newPassword } }
    );

    if (result.modifiedCount === 1) {
      console.log("Password updated successfully");
    } else {
      console.log("User not found or password not updated");
    }

    return result;
  } catch (err) {
    console.error("Error occurred while updating user password", err);
    throw err;
  }
};

const findUserInResetPassword = async (username) => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("resetPassword");

    const result = await collection.findOne({ username });
    console.log("User found in resetPassword:", result);
    return result;
  } catch (err) {
    console.error("Error occurred while finding user in resetPassword", err);
    throw err;
  }
};

const addToResetPassword = async (username, secretToken) => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("resetPassword");

    // Set a TTL with a lifetime of 30 minutes (1800 seconds)
    const resetPasswordEntry = {
      username,
      secretToken,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(resetPasswordEntry, {
      expireAfterSeconds: 1800,
    });
    console.log("Reset password entry added successfully");
    return result;
  } catch (err) {
    console.error("Error occurred while adding to resetPassword", err);
    throw err;
  }
};

const deleteUserTokenByUsername = async (username) => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("resetPassword");

    const result = await collection.deleteOne({ username });

    if (result.deletedCount === 1) {
      console.log("User token deleted successfully");
    } else {
      console.log("User token not found or deletion unsuccessful");
    }

    return result;
  } catch (err) {
    console.error("Error occurred while deleting user token", err);
    throw err;
  }
};

const updateUserAddress = async (username, address) => {
  try {
    await connectToDatabase();
    const db = client.db("Mandatory");
    const collection = db.collection("users");

    const result = await collection.updateOne(
      { username },
      {
        $set: {
          address,
        },
      }
    );

    if (result.modifiedCount === 1) {
      console.log("User address updated successfully");
    } else {
      console.log("User not found or address not updated");
    }

    return result;
  } catch (err) {
    console.error("Error occurred while updating user address", err);
    throw err;
  }
};

export {
  createUser,
  findUserByUsername,
  findAllUsers,
  createAdminUser,
  updateUserPassword,
  findUserInResetPassword,
  addToResetPassword,
  deleteUserTokenByUsername,
  closeDatabaseConnection,
  updateUserAddress
};