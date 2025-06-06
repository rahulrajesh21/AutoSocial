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


export async function updateTemplate(token,id,flowData){
  console.log(flowData)
  const res = await fetch(
    `http://localhost:3000/api/CreateAutomation`,
    {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({id,flowData})
    }
    
  )
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

export async function getWorkflowById(token, id) {
  const res = await fetch(`http://localhost:3000/api/GetWorkflowById/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch workflow');
  const body = await res.json();
  
  return body.data;
}

export async function getInstagramPosts(token) {
  const res = await fetch(`http://localhost:3000/api/Getints`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch Instagram posts');
  return res.json();
}

export async function updateAutomationStatus(token, id, status) {
  const res = await fetch(`http://localhost:3000/api/UpdateAutomationStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update automation status');
  }

  return res.json();
}