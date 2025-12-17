# Todo App (HTML/CSS/JS)

A tiny, dependency-free todo app:
- Add todos via the input and "Add" button
- See the list update instantly
- Delete any item with its button
- Persists between refreshes via `localStorage`
- Filter by All / Active / Completed

## Run locally

Any static server works. Two easy options:

### Python 3

```bash
cd /Users/antonis/Projects/t/todo-app
python3 -m http.server 8000
```
Open http://localhost:8000

### VS Code Live Server (optional)
Install "Live Server" extension, then right-click `index.html` → "Open with Live Server".

## Files
- `index.html` — structure and UI
- `styles.css` — minimal styling
- `script.js` — add/delete/complete, filters, and localStorage persistence

## Filters
- Use the buttons under the list: All / Active / Completed.
- The current filter is remembered across reloads.
- Mark an item complete with the checkbox; it will move according to the selected filter.
