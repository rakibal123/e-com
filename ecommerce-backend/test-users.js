const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);
async function run() {
    const users = await User.find({});
    console.log(users.map(u => ({ email: u.email, name: u.name, _id: u._id })));
    mongoose.disconnect();
}
run();
