const apiUrl = 'https://jsonplaceholder.typicode.com/users';

// Fetch users and display them
function fetchUsers() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const userTableBody = document.querySelector('#userTable tbody');
      userTableBody.innerHTML = ''; // Clear current table rows

      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name.split(' ')[0]}</td>
          <td>${user.name.split(' ')[1]}</td>
          <td>${user.email}</td>
          <td>${user.company.name}</td>
          <td>
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
        userTableBody.appendChild(row);
      });
    })
    .catch(error => {
      alert('Failed to fetch users');
      console.error('Error fetching users:', error);
    });
}

// Show the add/edit user form
function showUserForm(isEdit = false, user = null) {
  const formTitle = document.getElementById('formTitle');
  const userId = document.getElementById('userId');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const department = document.getElementById('department');

  if (isEdit) {
    formTitle.textContent = 'Edit User';
    userId.value = user.id;
    firstName.value = user.name.split(' ')[0];
    lastName.value = user.name.split(' ')[1];
    email.value = user.email;
    department.value = user.company.name;
  } else {
    formTitle.textContent = 'Add User';
    userId.value = '';
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    department.value = '';
  }

  document.getElementById('userFormModal').style.display = 'flex';
}

// Hide the form
function hideUserForm() {
  document.getElementById('userFormModal').style.display = 'none';
}

// Add new user
function addUser(user) {
  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      alert('User added successfully');
      fetchUsers(); // Refresh user list
      hideUserForm();
    })
    .catch(error => {
      alert('Failed to add user');
      console.error('Error adding user:', error);
    });
}

// Edit user
function editUser(userId) {
  fetch(`${apiUrl}/${userId}`)
    .then(response => response.json())
    .then(user => {
      showUserForm(true, user);
    })
    .catch(error => {
      alert('Failed to fetch user details');
      console.error('Error fetching user:', error);
    });
}

// Save edited user
function saveEditedUser() {
  const user = {
    id: document.getElementById('userId').value,
    name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
    email: document.getElementById('email').value,
    company: {
      name: document.getElementById('department').value,
    },
  };

  fetch(`${apiUrl}/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      alert('User edited successfully');
      fetchUsers(); // Refresh user list
      hideUserForm();
    })
    .catch(error => {
      alert('Failed to edit user');
      console.error('Error editing user:', error);
    });
}

// Delete user
function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`${apiUrl}/${userId}`, {
      method: 'DELETE',
    })
      .then(() => {
        alert('User deleted successfully');
        fetchUsers(); // Refresh user list
      })
      .catch(error => {
        alert('Failed to delete user');
        console.error('Error deleting user:', error);
      });
  }
}

// Handle form submission
document.getElementById('userForm').addEventListener('submit', event => {
  event.preventDefault();
  const userId = document.getElementById('userId').value;
  if (userId) {
    saveEditedUser();
  } else {
    const user = {
      name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
      email: document.getElementById('email').value,
      company: {
        name: document.getElementById('department').value,
      },
    };
    addUser(user);
  }
});

// Close form button
document.getElementById('closeFormBtn').addEventListener('click', hideUserForm);

// Show add user form when button is clicked
document.getElementById('addUserBtn').addEventListener('click', () => {
  showUserForm();
});

// Initially fetch users when the page loads
fetchUsers();
