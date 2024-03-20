'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// Define interface for user object
interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}


const UserList: React.FC = () => {
  
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ id: 0, username: '', name: '', email: '', phone: '', password: '' });
  const [editedUsers, setEditedUsers] = useState<{ [key: number]: User }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      } else {
        console.error('Failed to fetch user list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        toast.success('New user added successfully');
        fetchUsers(); // Refresh the user list
        setNewUser({ id: 0, username: '', name: '', email: '', phone: '', password: '' });
   
      } else {
        console.error('Failed to add new user:', response.statusText);
        toast.error('Failed to add new user');
      }
    } catch (error) {
      console.error('Error adding new user:', error);
      toast.error('An error occurred while adding new user');
    }
  };

  const handleEditUser = (userId: number, fieldName: string, value: string) => {
    setEditedUsers((prev) => ({ ...prev, [userId]: { ...prev[userId], [fieldName]: value } }));
  };

  const handleSaveEdit = async (userId: number) => {
    setIsLoading(true);
    try {
      const user = editedUsers[userId];
      console.log('editedUsers', editedUsers)
      console.log('user', user)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        toast.success('User details updated successfully');
        fetchUsers(); // Refresh the user list
        setEditedUsers((prev) => ({ ...prev, [userId]: undefined }));
      } else {
        console.error('Failed to update user details:', response.statusText);
        toast.error('Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error('An error occurred while updating user details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>User List</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newUser.phone}
          onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {!editedUsers[user.id] ? (
                  user.username
                ) : (
                  <input
                    type="text"
                    value={editedUsers[user.id]?.username || user.username}
                    onChange={(e) => handleEditUser(user.id, 'username', e.target.value)}
                  />
                )}
              </td>
              <td>
                {!editedUsers[user.id] ? (
                  user.name
                ) : (
                  <input
                    type="text"
                    value={editedUsers[user.id]?.name || user.name}
                    onChange={(e) => handleEditUser(user.id, 'name', e.target.value)}
                  />
                )}
             </td>
             <td>
                {!editedUsers[user.id] ? (
                  user.email
                ) : (
                  <input
                    type="text"
                    value={editedUsers[user.id]?.email || user.email}
                    onChange={(e) => handleEditUser(user.id, 'email', e.target.value)}
                  />
                )}
              </td>
              <td>
                {!editedUsers[user.id] ? (
                  user.phone
                ) : (
                  <input
                    type="text"
                    value={editedUsers[user.id]?.phone || user.phone}
                    onChange={(e) => handleEditUser(user.id, 'phone', e.target.value)}
                  />
                )}
              </td>
              <td>
                {!editedUsers[user.id] ? (
                  user.password
                ) : (
                  <input
                    type="text"
                    value={editedUsers[user.id]?.password || user.password}
                    onChange={(e) => handleEditUser(user.id, 'password', e.target.value)}
                  />
                )}
              </td>
              <td>
                {!editedUsers[user.id] ? (
                  <button onClick={() => setEditedUsers((prev) => ({ ...prev, [user.id]: {} }))}>Edit</button>
                ) : (
                  <button onClick={() => handleSaveEdit(user.id)} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;


