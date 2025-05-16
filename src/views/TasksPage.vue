<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTasks, createTask, updateTask } from '../services/taskService.js';
import '../styles/tasksPage.css';
const taskStatuses = [
  { label: 'Pending', value: 0 },
  { label: 'In Progress', value: 1 },
  { label: 'Completed', value: 2 },
];
const route = useRoute();
const router = useRouter();

const projectId = route.params.projectId;
const projectName = ref(route.query.projectName || '');

const tasks = ref([]);
const newTask = ref({
  title: '',
  description: '',
  dueDate: '',
});

const editingTaskId = ref(null);
const editedTask = ref({});

async function fetchTasks() {
  const data = await getTasks(projectId);
  tasks.value = data; 
  if (!projectName.value && tasks.value.length > 0 && tasks.value[0].project?.name) {
    projectName.value = tasks.value[0].project.name;
  }
}

async function addTask() {
  await createTask({ 
    projectId,
    title: newTask.value.title,
    description: newTask.value.description,
    dueDate: new Date(newTask.value.dueDate).toISOString(),
  });
  newTask.value = { title: '', description: '', dueDate: '' };
  await fetchTasks();
}

function startEditTask(task) {
  editingTaskId.value = task.id;
  editedTask.value = {
    ...task,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',  
  };
}

async function saveTask() {
  await updateTask(editedTask.value);
  editingTaskId.value = null;
  await fetchTasks();
}

function cancelEdit() {
  editingTaskId.value = null;
}

function backToProjects() {
  router.push({ name: 'Projects' });
}

onMounted(fetchTasks);
</script>

<template>
  <div class="tasks-container">
    <header>
      <button class="back-button" @click="backToProjects">Back</button>
      <h1>Tasks for {{ projectName || projectId }}</h1>
    </header>

    <section class="add-task">
      <input v-model="newTask.title" placeholder="Title" />
      <input v-model="newTask.description" placeholder="Description" />
      <input type="date" v-model="newTask.dueDate" />
      <button style="width: 50%;" @click="addTask">Add Task</button>
    </section>

    <table class="tasks-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td v-if="editingTaskId === task.id">
            <input v-model="editedTask.title" />
          </td>
          <td v-else>{{ task.title }}</td>

          <td v-if="editingTaskId === task.id">
            <input v-model="editedTask.description" />
          </td>
          <td v-else>{{ task.description }}</td>

          <td v-if="editingTaskId === task.id">
            <input type="date" v-model="editedTask.dueDate" />
          </td>
          <td v-else>{{ new Date(task.dueDate).toLocaleDateString() }}</td>

            <td v-if="editingTaskId === task.id">
            <select v-model="editedTask.status">
                <option v-for="status in taskStatuses" :key="status.value" :value="status.value">
                {{ status.label }}
                </option>
            </select>
            </td>
            <td v-else>
            {{ task.status === 0 ? 'Pending' : task.status === 1 ? 'In Progress' : 'Completed' }}
            </td>
          <td>
            <button v-if="editingTaskId === task.id" @click="saveTask">Save</button>
            <button v-if="editingTaskId === task.id" @click="cancelEdit">Cancel</button>
            <button v-else @click="startEditTask(task)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
