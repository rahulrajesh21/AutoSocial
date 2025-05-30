const BASE_URL = '/api';

export async function createWorkflow(name, description, token) {
  const res = await fetch(`http://localhost:3000/api/Createworkflow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create workflow');
  }

  return res.json();
}

export async function getAllWorkflows(token) {
  const res = await fetch(`http://localhost:3000/api/GetAllworkflows`,{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch workflows');
  const body  = await res.json();

  return body.data;
}