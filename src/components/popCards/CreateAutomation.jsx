import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { createWorkflow } from '../../utils/api';
import { toast } from 'react-toastify';
const CreateAutomation = ({ name, setName, description, setDescription, onClose }) => {
  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await createWorkflow(name, description, token); // pass token explicitly
      toast.success('🎉 Workflow created successfully!');
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error creating workflow:', error.message);
      toast.error('Failed to create workflow');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Create Workflow</h2>
          <button onClick={onClose}>
            <X color="black" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Automation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAutomation;