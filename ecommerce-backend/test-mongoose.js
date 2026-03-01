const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    name: String,
    password: { type: String, required: true }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const TestUser = mongoose.model('TestUser', userSchema);

async function run() {
    try {
        const u = new TestUser({ name: 'test', password: 'abc' });
        await u.save();
        
        const found = await TestUser.findById(u._id);
        found.name = 'test2';
        await found.save(); // Does it say next is not a function?
        
        console.log("Success! No next is not a function error.");
        await TestUser.deleteOne({ _id: u._id });
        mongoose.disconnect();
    } catch(e) {
        console.error(e);
    }
}
run();
