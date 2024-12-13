const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Mongoose Schema and Model
const studentSchema = new mongoose.Schema({
    regdNo: { type: String, unique: true, required: true },
    name: String,
    email: String,
    age: Number,
    mobileNo: String,
    department: String,
});

const Student = mongoose.model('Student', studentSchema);

// Routes

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Get a specific student by regdNo
app.get('/api/students/:regdNo', async (req, res) => {
    const { regdNo } = req.params;

    try {
        const student = await Student.findOne({ regdNo });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
});

// Add a new student
app.post('/api/students', async (req, res) => {
    const { regdNo, name, email, age, mobileNo, department } = req.body;

    try {
        const newStudent = new Student({ regdNo, name, email, age, mobileNo, department });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ message: 'Error adding student', error: error.message });
    }
});

// Update student details
app.put('/api/students/:regdNo', async (req, res) => {
    const { regdNo } = req.params;
    const { name, email, age, mobileNo, department } = req.body;

    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { regdNo },
            { name, email, age, mobileNo, department },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: 'Error updating student', error: error.message });
    }
});

// Delete a student
app.delete('/api/students/:regdNo', async (req, res) => {
    const { regdNo } = req.params;

    try {
        const deletedStudent = await Student.findOneAndDelete({ regdNo });
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting student', error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
