const apiUrl = 'http://localhost:3000/api/students';

// Fetch and display all students
async function fetchStudents() {
    const response = await fetch(apiUrl);
    const students = await response.json();

    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.regdNo}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.mobileNo}</td>
            <td>${student.department}</td>
            <td>
                <button onclick="editStudent('${student.regdNo}')">Edit</button>
                <button onclick="deleteStudent('${student.regdNo}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add or update student
async function addOrUpdateStudent(event) {
    event.preventDefault();

    const regdNo = document.getElementById('regdNo').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = document.getElementById('age').value.trim();
    const mobileNo = document.getElementById('mobileNo').value.trim();
    const department = document.getElementById('department').value.trim();

    const student = { regdNo, name, email, age, mobileNo, department };

    const method = document.getElementById('regdNo').disabled ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${apiUrl}/${regdNo}` : apiUrl;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
        });

        if (response.ok) {
            document.getElementById('studentForm').reset();
            document.getElementById('regdNo').disabled = false; // Re-enable regdNo field
            fetchStudents();
        } else {
            console.error('Error adding/updating student');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Edit student
async function editStudent(regdNo) {
    try {
        const response = await fetch(`${apiUrl}/${regdNo}`);
        const student = await response.json();

        document.getElementById('regdNo').value = student.regdNo;
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('age').value = student.age;
        document.getElementById('mobileNo').value = student.mobileNo;
        document.getElementById('department').value = student.department;

        document.getElementById('regdNo').disabled = true; // Disable regdNo field for editing
    } catch (error) {
        console.error('Error fetching student details:', error);
    }
}

// Delete student
async function deleteStudent(regdNo) {
    try {
        const response = await fetch(`${apiUrl}/${regdNo}`, { method: 'DELETE' });

        if (response.ok) {
            fetchStudents();
        } else {
            console.error('Error deleting student');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('studentForm').addEventListener('submit', addOrUpdateStudent);
fetchStudents();
