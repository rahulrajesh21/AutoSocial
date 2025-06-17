const BASE_URL = 'https://auto-social-backend.vercel.app/api';

export async function createWorkflow(name, description, token) {
  const res = await fetch(`${BASE_URL}/Createworkflow`, {
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


export async function createScheduledPost(token, formData) {
  console.log('Creating scheduled post with data:', formData);
  
  try {
    const res = await fetch(`${BASE_URL}/CreateScheduleAutomation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, 
    });
    
    console.log('Response status:', res.status);
    
    const responseData = await res.json();
    console.log('Response data:', responseData);
    
    if (!res.ok) {
      throw new Error(responseData.message || responseData.error || 'Failed to create scheduled post');
    }
    
    // Add success flag if not present in the response
    if (responseData.success === undefined) {
      responseData.success = true;
    }
    
    return responseData;
  } catch (error) {
    console.error('Error in createScheduledPost:', error);
    throw error;
  }
}

export async function updateTemplate(token,id,flowData){
  console.log(flowData)
  const res = await fetch(
    `${BASE_URL}/CreateAutomation`,
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
  const res = await fetch(`${BASE_URL}/GetAllworkflows`,{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch workflows');
  }
  
  const body  = await res.json();
  return body.data;
}

export async function getWorkflowById(token, id) {
  const res = await fetch(`${BASE_URL}/GetWorkflowById/${id}`, {
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
  const res = await fetch(`${BASE_URL}/Getints`, {
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
  const res = await fetch(`${BASE_URL}/UpdateAutomationStatus`, {
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