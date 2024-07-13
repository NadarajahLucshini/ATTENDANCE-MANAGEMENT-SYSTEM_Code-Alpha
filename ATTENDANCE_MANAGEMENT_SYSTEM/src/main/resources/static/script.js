const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const attendanceForm = document.getElementById('attendanceForm');
const studentSelect = document.getElementById('studentSelect');
const attendanceList = document.getElementById('attendanceList');

// Fetch all students when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await fetchStudents();
    await fetchAttendance();
});

// Student form submission
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;

    const student = { name, email };
    
    await addStudent(student);
    fetchStudents(); // Refresh the student list
});

// Attendance form submission
attendanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentId = studentSelect.value;
    const date = document.getElementById('attendanceDate').value;
    const present = document.getElementById('attendancePresent').checked;

    const attendance = { student: { id: studentId }, date, present };
    
    await addAttendance(attendance);
    fetchAttendance(); // Refresh the attendance list
});

// Fetch students from the backend
async function fetchStudents() {
    try {
        const response = await fetch('/students');
        if (!response.ok) throw new Error('Network response was not ok');

        const students = await response.json();
        studentList.innerHTML = '';
        studentSelect.innerHTML = '';

        students.forEach(student => {
            const li = document.createElement('li');
            li.textContent = `${student.name} (${student.email}) `;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                await deleteStudent(student.id);
                fetchStudents(); // Refresh the student list
            });

            li.appendChild(deleteButton);
            studentList.appendChild(li);

            // Add to attendance dropdown
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.email})`;
            studentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

// Add a new student
async function addStudent(student) {
    await fetch('/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });
}

// Delete a student
async function deleteStudent(id) {
    await fetch(`/students/${id}`, {
        method: 'DELETE',
    });
}

// Fetch attendance records
async function fetchAttendance() {
    try {
        const response = await fetch('/attendances'); // Adjust if you have a different endpoint
        if (!response.ok) throw new Error('Network response was not ok');

        const attendances = await response.json();
        attendanceList.innerHTML = '';

        attendances.forEach(attendance => {
            const li = document.createElement('li');
            li.textContent = `Student ID: ${attendance.student.id}, Date: ${attendance.date}, Present: ${attendance.present}`;
            attendanceList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
    }
}

// Add a new attendance
async function addAttendance(attendance) {
    await fetch('/attendances', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendance),
    });
}
