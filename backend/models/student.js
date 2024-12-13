const mongoose = require('mongoose');

// Define the schema
const studentSchema = new mongoose.Schema({
    regdNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true, min: 1 },
    mobileNo: { type: String, required: true },
    department: { type: String, required: true },
});

// Export the model
module.exports = mongoose.model('Student', studentSchema);
