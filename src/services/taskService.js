const API_BASE_URL = 'https://localhost:7266';

export async function getTasks(projectId) {
  const url = new URL(`${API_BASE_URL}/TaskQuery/Task.GetAll`);
  url.searchParams.set('ProjectId', projectId);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Failed to get tasks: ${response.statusText}`);
  return response.json();
}

export async function createTask(task) {
  const response = await fetch(`${API_BASE_URL}/TaskCommand/Task.Create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error(`Failed to create task: ${response.statusText}`);
  return response.json();
}

export async function updateTask(task) {
  const response = await fetch(`${API_BASE_URL}/TaskCommand/Task.Update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error(`Failed to update task: ${response.statusText}`);
  return response.json();
}
