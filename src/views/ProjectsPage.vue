<script>
import { ref, onMounted, watch } from 'vue';
import { getProjects, updateProject, createProject } from '../services/projectService.js';
import '../styles/projectList.css';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter(); 
    
    const newProjectName = ref(''); 
    const projects = ref([]);
    const currentPage = ref(1);
    const limit = 5;
    const totalPages = ref(1);

    const editingProject = ref(null);
    const editedName = ref('');

    async function fetchProjects() {
      const data = await getProjects({ limit, page: currentPage.value });
      projects.value = data.items;
      totalPages.value = data.meta.totalPages;
    }

    watch(currentPage, () => {
      fetchProjects();
    });

    function startEdit(project) {
      editingProject.value = project;
      editedName.value = project.name;
    }
function manageTasks(project) { 
  router.push({ 
    name: 'TasksPage', 
    params: { projectId: project.id }, 
    query: { projectName: project.name }
  });
}    async function handleCreateProject() {
        if (!newProjectName.value.trim()) {
            alert('Project name is required.');
            return;
        } 
  try {
    await createProject({ name: newProjectName.value });
    newProjectName.value = '';
    currentPage.value = 1;  
    await fetchProjects();
  } catch (error) {
    alert(error.message);
  }
}

    async function saveEdit() {
      await updateProject({ id: editingProject.value.id, name: editedName.value });
      editingProject.value = null;
      await fetchProjects();
    }

    function cancelEdit() {
      editingProject.value = null;
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    }

    function prevPage() {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    }

    onMounted(fetchProjects);

    return {
      projects,
      currentPage,
      totalPages,
      editingProject,
      editedName,
      startEdit,
      saveEdit,
      cancelEdit,
      nextPage,
      prevPage,
     newProjectName,
     manageTasks, 
     handleCreateProject,
    };
  },
};
</script>


<template>
  <div class="project-list-container">
    <h1 class="header">Projects</h1>
<div class="create-project-form">
  <input
    type="text"
    v-model="newProjectName"
    placeholder="Enter new project name"
  />
  <button @click="handleCreateProject">Create Project</button>
</div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Created Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td v-if="editingProject && editingProject.id === project.id">
            <input v-model="editedName" />
          </td>
          <td v-else>{{ project.name }}</td>

          <td>{{ new Date(project.createdDate).toLocaleDateString() }}</td>

        <td>
  <button v-if="editingProject && editingProject.id === project.id" @click="saveEdit">Save</button>
  <button v-if="editingProject && editingProject.id === project.id" @click="cancelEdit">Cancel</button> 
  <template v-else>
    <button @click="startEdit(project)">Edit</button>
    <button @click="manageTasks(project)">Manage Tasks</button>
  </template>
</td>

        </tr>
      </tbody>
    </table>
<div class="pagination">
  <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
  <span>Page {{ currentPage }} of {{ totalPages }}</span>
  <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
</div>



  </div>
</template>
