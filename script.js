(function () {
  const STORAGE_KEY = 'todos-v1';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveTodos(todos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore storage errors
    }
  }

  function render(todos) {
    list.innerHTML = '';

    if (!todos.length) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'No todos yet — add one above!';
      list.appendChild(empty);
      return;
    }

    for (const todo of todos) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = todo.id;

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'todo-delete';
      del.setAttribute('aria-label', `Delete ${todo.text}`);
      del.textContent = 'Delete';

      del.addEventListener('click', () => {
        const next = loadTodos().filter(t => t.id !== todo.id);
        saveTodos(next);
        render(next);
        input.focus();
      });

      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    }
  }

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const todos = loadTodos();
    const todo = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(), text: trimmed };
    const next = [todo, ...todos];
    saveTodos(next);
    render(next);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  // Initial render
  render(loadTodos());
})();
