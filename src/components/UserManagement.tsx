import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../config';

interface User {
  id: number;
  name: string;
  birthDate: string;
  address: string;
  idNumber: string;
  phone: string;
  email: string;
  workUnit: string;
  position: string;
  issueDate: string;
  joinDate: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    birthDate: '',
    address: '',
    idNumber: '',
    phone: '',
    email: '',
    workUnit: '',
    position: '',
    issueDate: '',
    joinDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users?page=${currentPage}&limit=${usersPerPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      fetchUsers();
      setShowAddModal(false);
      setNewUser({
        name: '',
        birthDate: '',
        address: '',
        idNumber: '',
        phone: '',
        email: '',
        workUnit: '',
        position: '',
        issueDate: '',
        joinDate: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="border rounded-lg pl-10 pr-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} className="mr-2" /> Add User
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Birth Date</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.birthDate}</td>
                <td className="px-4 py-2">{user.position}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 mr-2">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-500">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center items-center">
        <button
          className="mr-2 px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="ml-2 px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded-lg px-3 py-2 mb-2"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg px-3 py-2 mb-2"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full border rounded-lg px-3 py-2 mb-2"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <input
              type="date"
              placeholder="Birth Date"
              className="w-full border rounded-lg px-3 py-2 mb-2"
              value={newUser.birthDate}
              onChange={(e) => setNewUser({ ...newUser, birthDate: e.target.value })}
            />
            <input
              type="text"
              placeholder="Position"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              value={newUser.position}
              onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;