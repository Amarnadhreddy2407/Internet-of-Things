let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const filter = document.getElementById("filter");
const sort = document.getElementById("sort");
const progressBar = document.getElementById("progressBar");
const completedTasks = document.getElementById("completedTasks");
const totalTasks = document.getElementById("totalTasks");

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter.value !== "All") {
    filteredTasks = filteredTasks.filter(t => t.status === filter.value);
  }

  if (sort.value === "deadline") {
    filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (sort.value === "title") {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  filteredTasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.classList.add("task-card");
    div.innerHTML = `
      <div class="task-info">
        <strong>${task.title}</strong> <br>
        Deadline: ${task.deadline} <br>
        ${task.description}
      </div>
      <div class="task-actions">
        <select onchange="updateStatus(${index}, this.value)">
          <option ${task.status==="Pending"?"selected":""}>Pending</option>
          <option ${task.status==="In Progress"?"selected":""}>In Progress</option>
          <option ${task.status==="Completed"?"selected":""}>Completed</option>
        </select>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });

  updateProgress();
}

// Add Task
addBtn.addEventListener("click", () => {
  const title = document.getElementById("taskTitle").value;
  const desc = document.getElementById("taskDesc").value;
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  if (!title || !deadline) {
    alert("Please enter title and deadline!");
    return;
  }

  tasks.push({ title, description: desc, deadline, status });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
});

// Clear All
clearBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
});

// Update Status
function updateStatus(index, status) {
  tasks[index].status = status;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Delete Task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Progress
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  progressBar.value = total ? (completed / total) * 100 : 0;
}

filter.addEventListener("change", renderTasks);
sort.addEventListener("change", renderTasks);

// Initial Render
renderTasks();
