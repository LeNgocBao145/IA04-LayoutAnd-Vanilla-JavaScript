import { users } from './user.js';

let editingUserId = null;

function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    let isValid = true;

    // Reset error messages
    document.querySelectorAll('.text-red-500:not(span)').forEach(span => span.classList.add('hidden'));

    // Validate First Name
    if (!firstName) {
        document.getElementById('firstNameError').textContent = 'First name is required';
        document.getElementById('firstNameError').classList.remove('hidden');
        isValid = false;
    } else if (firstName.length < 2) {
        document.getElementById('firstNameError').textContent = 'First name must be at least 2 characters';
        document.getElementById('firstNameError').classList.remove('hidden');
        isValid = false;
    }

    // Validate Last Name
    if (!lastName) {
        document.getElementById('lastNameError').textContent = 'Last name is required';
        document.getElementById('lastNameError').classList.remove('hidden');
        isValid = false;
    } else if (lastName.length < 2) {
        document.getElementById('lastNameError').textContent = 'Last name must be at least 2 characters';
        document.getElementById('lastNameError').classList.remove('hidden');
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        document.getElementById('emailError').classList.remove('hidden');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('emailError').classList.remove('hidden');
        isValid = false;
    }else if (editingUserId === null && users.some(user => user.email === email)) {
        document.getElementById('emailError').textContent = 'Email already exists';
        document.getElementById('emailError').classList.remove('hidden');
        isValid = false;
    }

    return isValid;
}

function renderUserList() {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        
        row.innerHTML = `
            <td class="py-2 px-4 text-center">${user.id}</td>
            <td class="py-2 px-4">${user.firstName} ${user.lastName}</td>
            <td class="py-2 px-4">${user.email}</td>
            <td class="py-2 px-4 flex gap-2 justify-center">
                <button onclick="editUser(${user.id})" 
                        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Edit
                </button>
                <button onclick="deleteUser(${user.id})"
                        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function clearForm() {
    document.getElementById('userForm').reset();
    editingUserId = null;
    // Clear error messages
    document.querySelectorAll('.text-red-500:not(span)').forEach(span => span.classList.add('hidden'));
}

window.editUser = function(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        editingUserId = id;
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('email').value = user.email;
    }
}

window.deleteUser = function(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            renderUserList();
            if (editingUserId === id) {
                clearForm();
            }
        }
    }
}

function registerUser() {
    if (!validateForm()) return;

    const newUser = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim()
    };

    users.push(newUser);
    renderUserList();
    clearForm();
}

function updateUser() {
    if (!validateForm()) return;

    const userIndex = users.findIndex(u => u.id === editingUserId);
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim()
        };
        renderUserList();
        clearForm();
    }
}

// Initialize the table and attach event listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderUserList();
    const headerLinks = document.querySelectorAll("header [data-link]");
    const footerLinks = document.querySelectorAll("footer [data-link]");

    function clearActive() {
      headerLinks.forEach(link => link.classList.remove("text-red-500", "underline"));
      footerLinks.forEach(link => link.classList.remove("text-orange-500"));
    }

    function setActive(section) {
      clearActive();

      // Header: đỏ + gạch dưới
      document.querySelector(`header [data-link="${section}"]`).classList.add("text-red-500");

      // Footer: cam
      document.querySelector(`footer [data-link="${section}"]`).classList.add("text-orange-500", "underline");
    }

    // Khi bấm vào header hoặc footer đều sync
    headerLinks.forEach(link => {
      link.addEventListener("click", () => {
        setActive(link.dataset.link);
      });
    });

    footerLinks.forEach(link => {
      link.addEventListener("click", () => {
        setActive(link.dataset.link);
      });
    });

    // Mặc định chọn Home
    setActive("home");
    document.getElementById('updateBtn').addEventListener('click', updateUser);
    document.getElementById('registerBtn').addEventListener('click', registerUser);
});