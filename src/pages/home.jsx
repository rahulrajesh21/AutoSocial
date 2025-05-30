import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AutomationCards } from '../components/cards/AutomationCards';
import CreateAutomation from '../components/popCards/CreateAutomation';
import { createWorkflow,getAllWorkflows } from '../utils/api';
import { useAuth } from '@clerk/clerk-react';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workflows, setWorkflows] = useState([]);
   const { getToken } = useAuth();
 useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const token = await getToken();
        const data = await getAllWorkflows(token);
        setWorkflows(data);
      } catch (err) {
        console.error('Error fetching workflows:', err);
        toast.error('Failed to fetch workflows');
      }
    };

    fetchWorkflows();
  }, [getToken]);
  const handleWorkflowSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createWorkflow(name, description);
      console.log('Created:', data);
      setShowPopup(false);
      setName('');
      setDescription('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-6 h-full text-white relative">
      <div className="flex items-center justify-between border-b border-borderColor w-full p-4">
        <h1 className="text-4xl font-semibold">Workflows</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="p-2 bg-white rounded-lg transition-colors"
        >
          <Plus color="black" size={24} />
        </button>
      </div>

      <div className="flex flex-col mt-6 p-4 space-y-2">
      {workflows.map((workflow) => (
        <AutomationCards key={workflow.id} workflow={workflow} />
      ))}
      </div>

      {showPopup && (
        <CreateAutomation
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          onClose={() => setShowPopup(false)}
          onSubmit={handleWorkflowSubmit}
        />
      )}
    </div>
  );
};

export default Home;