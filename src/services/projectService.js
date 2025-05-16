const API_BASE_URL = 'https://localhost:7266';

export async function getProjects({ limit = 1, page = 1, orderBy = 'id', sort = 'asc' } = {}) {
  const url = new URL(`${API_BASE_URL}/ProjectQuery/Project.GetAll`);
  url.searchParams.set('Limit', limit);
  url.searchParams.set('Page', page);
  url.searchParams.set('OrderBy', orderBy);
  url.searchParams.set('Sort', sort);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    throw new Error(message);
  }
  return response.json();
} 

export async function updateProject(project) {
  const response = await fetch('https://localhost:7266/ProjectCommand/Project.Update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  return response.json();
}

export async function createProject(payload) {
  const response = await fetch(`${API_BASE_URL}/ProjectCommand/Project.Create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = `Error creating project: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}


