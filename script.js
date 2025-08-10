document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const totalTasksSpan = document.getElementById('total-tasks');
  const pendingTasksSpan = document.getElementById('pending-tasks');
  const completedTasksSpan = document.getElementById('completed-tasks');

  // Load tasks from localStorage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.classList.toggle('completed', task.completed);

      // Editable span for task text
      const taskSpan = document.createElement('span');
      taskSpan.className = 'task-text';
      taskSpan.textContent = task.text;
      taskSpan.contentEditable = false;

      // Toggle completion on clicking text (except when editing)
      taskSpan.addEventListener('click', (e) => {
        if (!taskSpan.isContentEditable) {
          task.completed = !task.completed;
          li.classList.toggle('completed');
          saveTasks(tasks);
          updateTaskCounts(tasks);
        }
      });

      // Enable editing on double click
      taskSpan.addEventListener('dblclick', (e) => {
        taskSpan.contentEditable = true;
        taskSpan.focus();
        // Move cursor to end
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
      });

      // Save edits on blur or pressing Enter key
      const finishEditing = () => {
        taskSpan.contentEditable = false;
        const newText = taskSpan.textContent.trim();
        if (newText) {
          task.text = newText;
          saveTasks(tasks);
        } else {
          // If empty after edit, remove the task
          tasks.splice(index, 1);
          saveTasks(tasks);
          loadTasks();
          updateTaskCounts(tasks);
        }
      };

      taskSpan.addEventListener('blur', finishEditing);
      taskSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          taskSpan.blur();
        }
      });

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks(tasks);
        loadTasks();
        updateTaskCounts(tasks);
      });

      li.appendChild(taskSpan);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
    updateTaskCounts(tasks);
  };

  // Save tasks to localStorage
  const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Add new task
  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);
    taskInput.value = '';
    loadTasks();
  };

  // Update task counters
  const updateTaskCounts = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    totalTasksSpan.textContent = `Total: ${total}`;
    completedTasksSpan.textContent = `Completed: ${completed}`;
    pendingTasksSpan.textContent = `Pending: ${pending}`;
  };

  // Confirm before clearing all tasks
  const clearAllTasks = () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
      localStorage.removeItem('tasks');
      loadTasks();
    }
  };

  // Event Listeners
  addTaskBtn.addEventListener('click', addTask);
  clearAllBtn.addEventListener('click', clearAllTasks);

  // Add task on Enter key
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  loadTasks();
});
