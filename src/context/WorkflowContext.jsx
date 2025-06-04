import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllWorkflows } from '../utils/api';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const [workflows, setWorkflows] = useState([]);
  const { getToken } = useAuth();

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

  useEffect(() => {
    fetchWorkflows();
  }, [getToken]);

  return (
    <WorkflowContext.Provider value={{ workflows, setWorkflows, fetchWorkflows }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => useContext(WorkflowContext);