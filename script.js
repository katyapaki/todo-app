(function () {
  const STORAGE_KEY = 'todos-v1';
  const FILTER_KEY = 'todos-filter-v1';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const filterButtons = Array.from(document.querySelectorAll('.filters [data-filter]'));
  const countEl = document.getElementById('count');

  const filters = /** @type {const} */ ({ all: 'all', active: 'active', completed: 'completed' });
  let currentFilter = loadFilter();

  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // migrate older entries without done flag
      return Array.isArray(parsed)
        ? parsed.map(t => ({ id: t.id, text: t.text, done: !!t.done }))
        : [];
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

  function loadFilter() {
    const f = localStorage.getItem(FILTER_KEY);
    return f === filters.active || f === filters.completed ? f : filters.all;
  }
  function saveFilter(f) {
    try { localStorage.setItem(FILTER_KEY, f); } catch {}
  }

  function applyFilter(todos, f) {
    switch (f) {
      case filters.active: return todos.filter(t => !t.done);
      case filters.completed: return todos.filter(t => t.done);
      default: return todos;
    }
  }

  function updateCount(todos) {
    const remaining = todos.filter(t => !t.done).length;
    countEl.textContent = remaining === 1 ? '1 item left' : `${remaining} items left`;
  }

  function syncFilterButtons() {
    for (const btn of filterButtons) {
      btn.setAttribute('aria-selected', String(btn.dataset.filter === currentFilter));
    }
  }

  function render(todos) {
    list.innerHTML = '';
    updateCount(todos);
    syncFilterButtons();

    const visible = applyFilter(todos, currentFilter);
    if (!visible.length) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'No todos here — add or change the filter!';
      list.appendChild(empty);
      return;
    }

    for (const todo of visible) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = todo.id;

      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'todo-check';
      chk.checked = !!todo.done;
      chk.setAttribute('aria-label', `Mark as completed: ${todo.text}`);

      const span = document.createElement('span');
      span.className = 'todo-text' + (todo.done ? ' done' : '');
      span.textContent = todo.text;

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'todo-delete';
      del.setAttribute('aria-label', `Delete ${todo.text}`);
      del.textContent = 'Delete';

      chk.addEventListener('change', () => {
        const current = loadTodos();
        const next = current.map(t => t.id === todo.id ? { ...t, done: !t.done } : t);
        saveTodos(next);
        render(next);
      });

      del.addEventListener('click', () => {
        const next = loadTodos().filter(t => t.id !== todo.id);
        saveTodos(next);
        render(next);
        input.focus();
      });

      li.appendChild(chk);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    }
  }

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const todos = loadTodos();
    const todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
      text: trimmed,
      done: false,
    };
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

  for (const btn of filterButtons) {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      if (!f || f === currentFilter) return;
      currentFilter = f;
      saveFilter(currentFilter);
      render(loadTodos());
    });
  }

  // Initial render
  render(loadTodos());
})();
