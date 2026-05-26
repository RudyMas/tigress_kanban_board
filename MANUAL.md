# Programmer's Manual: Tigress Kanban Board Module

## Overview

This module provides a full Kanban board experience within the Tigress Framework.
It is designed as a Composer package (`tigress/kanban-board`) that integrates into
a host Tigress application. The module follows Tigress conventions:

| Directory   | Purpose                                     |
|-------------|---------------------------------------------|
| `config/`   | Route definitions consumed by Tigress Router|
| `public/`   | Front-end assets (CSS, JS) served via URL   |
| `src/`      | PHP back-end (Controllers, Repositories, Services) |
| `translations/` | JSON translation files for i18n          |

---

## 1. Package Configuration (`composer.json`)

The module declares itself as a `library` with PSR-4 autoloading:

```json
{
  "autoload": {
    "psr-4": {
      "Tigress\\": "src/",
      "Controller\\": "src/controllers",
      "Repository\\": "src/repositories",
      "Service\\": "src/services"
    }
  }
}
```

- **`src/KanbanBoard.php`** is a simple version-info class under namespace `Tigress\KanbanBoard`. It is placed at `src/` and matches the `Tigress\\` prefix.
- **Controllers** live in `src/controllers/kanban/`, namespace `Controller\kanban`, matching the `Controller\\` prefix.
- **Repositories** live in `src/repositories/`, namespace `Repository`, matching the `Repository\\` prefix.
- **Services** live in `src/services/`, namespace `Service`, matching the `Service\\` prefix.

When the host application requires this package via Composer, the `vendor/tigress/kanban-board/` directory is created and the autoloader maps these namespaces automatically.

---

## 2. Routes (`config/routes.json`)

The Tigress Router reads `config/routes.json` from the host application's root.
**This module's routes are NOT auto-discovered.** The host application must merge
this module's route definitions into its own `config/routes.json`, or the
host's `Core` bootstrap must be configured to load extra routes from vendor packages.

Route entries link URL patterns to controller/method pairs:

```json
{
  "request": "GET",
  "path": "/kanban",
  "controller": "kanban\\KanbanController",
  "method": "index",
  "level_rights": [100],
  "special_rights": "kanban",
  "special_rights_default": []
}
```

| Key | Meaning |
|-----|---------|
| `request` | HTTP method (`GET`, `POST`) |
| `path` | URL pattern; `{id}` and `{kanban_id}` are dynamic segments |
| `controller` | Class under `Controller\` namespace (e.g. `kanban\KanbanController` → `Controller\kanban\KanbanController`) |
| `method` | Method to invoke, receives arguments array with URL variables and request body |
| `level_rights` | Array of `access_level` values that are allowed |
| `special_rights` | Named permission key for per-user tool-specific rights |
| `special_rights_default` | Default access levels that auto-grant the special right |

### All routes at a glance

| Method | Path | Controller Method | Description |
|--------|------|-------------------|-------------|
| GET | `/kanban` | `KanbanController::index` | Kanban boards overview (DataTable) |
| GET | `/kanban/board/{id}` | `KanbanController::board` | Kanban board view with SortableJS columns |
| GET | `/kanban/edit/{id}` | `KanbanController::editKanban` | Create/edit a kanban board |
| GET | `/kanban/tasks/edit/{id}/{kanban_id}` | `KanbanController::editTasks` | Create/edit a task |
| GET | `/kanban/tasks/information/{id}/{kanban_id}` | `KanbanController::informationTasks` | Read-only task details |
| GET | `/kanban/get/{active}` | `KanbanCrudController::getAllByActive` | JSON data for DataTable (1=active, 0=archived) |
| POST | `/kanban/save` | `KanbanCrudController::saveKanban` | Save board |
| POST | `/kanban/tasks/save` | `KanbanCrudController::saveTasks` | Save task |
| POST | `/kanban/tasks/delete` | `KanbanCrudController::deleteTaak` | Delete task |
| POST | `/kanban/archive` | `KanbanCrudController::archive` | Soft-delete board |
| POST | `/kanban/restore` | `KanbanCrudController::restore` | Restore soft-deleted board |
| POST | `/kanban/board/update/status` | `KanbanCrudController::kanbanUpdateStatus` | Update task status (drag & drop) |

---

## 3. Database Tables

The module expects three tables, created by the host application (e.g. via
`SetupRepository` or manual migration scripts):

### `kanbans`

Stores kanban boards. Soft-delete enabled (`active`, `deleted`, `deleted_user_id`).

| Column | Type | Notes |
|--------|------|-------|
| `id` | int (PK, auto-increment) | |
| `name` | varchar | Project name |
| `tile` | varchar | Categorisation tile |
| `description` | text | Rich text (TinyMCE) |
| `product_owner_ids` | text | JSON array of user IDs |
| `team_member_ids` | text | JSON array of user IDs |
| `status` | int | 0=Not started … 5=On hold |
| `start_date` | datetime | |
| `end_date` | datetime | |
| `created` | datetime | Auto by Repository |
| `created_user_id` | int | Auto by Repository |
| `modified` | datetime | Auto by Repository |
| `modified_user_id` | int | Auto by Repository |
| `deleted` | datetime | Soft-delete timestamp |
| `deleted_user_id` | int | Soft-delete user ID |
| `active` | tinyint | Soft-delete flag (1=active) |

### `kanbans_statuses`

Defines named status columns on the board (e.g. "To Do", "In Progress", "Done").
Multi-language names stored as separate columns.

| Column | Type | Notes |
|--------|------|-------|
| `id` | int (PK, auto-increment) | |
| `name_en` | varchar | English label |
| `name_nl` | varchar | Dutch label |
| `name_fr` | varchar | French label |
| `name_de` | varchar | German label |
| `name_es` | varchar | Spanish label |
| `name_it` | varchar | Italian label |
| `name_sv` | varchar | Swedish label |
| `sort` | int | Column order on the board |
| `deadline_check` | tinyint | Whether to highlight overdue tasks |
| `active` | tinyint | |
| *(timestamps + user audit columns)* | | |

### `kanbans_tasks`

Stores individual task cards. Soft-delete enabled.

| Column | Type | Notes |
|--------|------|-------|
| `id` | int (PK, auto-increment) | |
| `kanban_id` | int | FK to `kanbans.id` |
| `name` | varchar | Task title |
| `description` | text | Rich text (TinyMCE) |
| `remark` | text | Additional notes (TinyMCE) |
| `kanban_status_id` | int | FK to `kanbans_statuses.id` → which column |
| `priority` | int | 1=Critical … 9=None |
| `worker_ids` | text | JSON array of user IDs assigned |
| `deadline` | datetime | Target completion date |
| `sort` | int | Order within column |
| `active` | tinyint | |
| *(timestamps + user audit columns)* | | |

---

## 4. PHP Code (`src/`)

### 4.1 Module Version Class (`src/KanbanBoard.php`)

```php
namespace Tigress;
class KanbanBoard
{
    public static function version(): string
    {
        return '2025.10.16';
    }
}
```

Minimal class under the `Tigress` namespace to expose module version info.

### 4.2 Controllers (`src/controllers/kanban/`)

Both controllers extend `Tigress\Controller`, which provides `checkRights()`.

#### `KanbanController`

Handles GET requests that render Twig templates.

- **Constructor:** Adds the module's view path to Twig and loads translation data.
  ```php
  TWIG->addPath('vendor/tigress/kanban-board/src/views');
  TRANSLATIONS->load(SYSTEM_ROOT . '/vendor/tigress/kanban-board/translations/translations.json');
  ```

- **`index()`** — Checks rights, redirects to login if needed, renders `kanban/index.twig` with localized status texts for the DataTable.
- **`board(array $args)`** — Loads statuses (ordered by `sort`), the kanban board by `id`, its tasks (ordered by `deadline, priority`), and renders the board view. Uses `SECURITY->checkAccess()` for referer validation.
- **`editKanban(array $args)`** — Loads board by `id` (or creates new empty model with `$kanbans->new()`). Pre-selects the current user as product owner for new boards. Prepares select options for product owners and team members via `UsersRepo`.
- **`editTasks(array $args)`** — Loads task by `id` (or new). Also loads the parent kanban, status options, worker select options (filtered to team members), and priority list.
- **`informationTasks(array $args)`** — Read-only task info page. Passes users, statuses, and priorities to the template.

#### `KanbanCrudController`

Handles POST data mutations (CRUD operations). Uses `#[NoReturn]` attributes
on methods that always redirect.

- **`saveKanban()`** — Encodes `product_owner_ids` and `team_member_ids` as JSON. If `$_POST['id'] > 0` loads existing, else creates new. Calls `updateByPost($_POST)` (which trims strings) then `save()`.
- **`saveTasks()`** — Same pattern for tasks. Encodes `worker_ids` as JSON.
- **`deleteTaak()`** — Soft-deletes a task by `$_POST['id']`.
- **`archive()`** — Soft-deletes (archives) a kanban board.
- **`restore()`** — Restores a soft-deleted board.
- **`kanbanUpdateStatus()`** — Updates `kanban_status_id` for drag-and-drop. Returns JSON `{ success: true }`.
- **`getAllByActive(array $args)`** — Returns DataTable JSON. For non-admin users, filters boards where the user is a product owner or team member (`LIKE %"id"%`).

### 4.3 Repositories (`src/repositories/`)

All extend `Tigress\Repository`. They configure table metadata in the constructor
and inherit full CRUD, soft-delete, iterator, and query methods.

#### `KanbansRepo` (table: `kanbans`)

- `$softDelete = true` — `deleteById()` issues `UPDATE active=0` instead of DELETE.
- Custom method `getTileList()` — `SELECT DISTINCT tile FROM kanbans` for the datalist autocomplete.

#### `KanbansStatusesRepo` (table: `kanbans_statuses`)

- `$softDelete = true`
- `getSelectOptions(int $kanban_status_id): string` — Generates `<option>` HTML for the status dropdown. Resolves the language-specific column name (`name_nl`, `name_en`, etc.) based on `CONFIG->website->html_lang`, with fallback to `name_en`.
- `getStatus(int $id): string` — Returns the language-specific status label for a given ID.

#### `KanbansTasksRepo` (table: `kanbans_tasks`)

- `$softDelete = true`
- No custom methods — inherits all from `Repository`.

### 4.4 Services (`src/services/`)

#### `LocalizationService`

A static helper providing localized label arrays.

- **`getStatuses(string $lang = 'en'): array`** — Returns a numeric array mapping status IDs to translated labels: `0 => Not started`, `1 => In preparation`, `2 => Developing`, `3 => Testing`, `4 => Done`, `5 => On hold`. Uses the `__()` function so values are translated per the active language.
- **`getPriorities(string $lang = 'en'): array`** — Returns a numeric array mapping priority levels (1=Critical/ASAP … 9=None) to localized labels.

---

## 5. Twig Templates (`src/views/kanban/`)

All templates extend either `base.twig` (standard pages) or `datatable.twig`
(the index page). They use the `__()` global Twig function for translations.

### `index.twig`

- Extends `datatable.twig` (provides DataTable CSS/JS framework).
- Renders a DataTable with columns: ID, Tile, Project Name, Start date, End date, Status, Actions.
- Toolbar has an Archive toggle and an Add button (if write permission).
- Two modals: **Archive** (confirmation, POST to `/kanban/archive`) and **Restore** (POST to `/kanban/restore`).
- JavaScript `variables` object passes `show`, rights, and `statuses` (for the status badge renderer).

### `kanban_board.twig`

- Extends `base.twig` + includes `Sortable.min.js` for drag-and-drop.
- Renders a horizontal flex layout with columns per status.
- Task cards show: title, executor names (via `users.getNames()`), target date, priority colour.
- Priority colour mapping inline:
  ```
  1: #00FF00 (Critical) → 9: #FF0000 (None)
  ```
- Deadline overdue highlighting: if `deadline_check` is true on the status and `today > deadline`, adds a red border.
- A task is draggable (`.is-draggable`) if the user has write rights or is assigned; otherwise it's locked (`.is-locked`).
- Delete modal at the bottom.
- Auto-refresh every 5 minutes (`setTimeout(() => location.reload(), 300000)`).

### `edit_kanban.twig`

- Extends `base.twig` + TinyMCE for the description field.
- Form fields: project name, tile (with `<datalist>` from `tileList`), status select, product owners (multi-select), team members (multi-select), start/end dates, description textarea.
- POSTs to `/kanban/save`.

### `edit_kanban_tasks.twig`

- Extends `base.twig` + TinyMCE for description and remark fields.
- Form fields: task name, priority select (9 levels), deadline, status, executors (multi-select filtered to team members), description, remark.
- Hidden field `kanban_id` links task to board.
- POSTs to `/kanban/tasks/save`.

### `information_tasks.twig`

- Extends `base.twig` (no TinyMCE — pure display).
- Two-column layout with kanban info (tile, name, status badge, product owners, team members, dates, description) and task info (name, status badge, ticket number `kanban_id-task_id`, priority, executors, deadline, description, remark).
- Status badge classes are mapped inline: `0→secondary, 1→primary, 2→info, 3→warning, 4→success, 5→danger`.

---

## 6. Front-end Assets (`public/`)

### 6.1 CSS

- **`kanban_board.css`** — Flexbox horizontal board layout, column cards with shadows, drag-and-drop visual feedback (blue border on hover over column, scale on card hover, opacity while dragging).
- **`edit_kanban.css`** / **`edit_kanban_tasks.css`** — Both simply make `<label>` bold.

### 6.2 JavaScript

All JS files are loaded via `<script src="{{ BASE_URL }}/vendor/tigress/kanban-board/public/javascript/kanban/...">` Twig references.

#### `index.js`

- Initialises a DataTable with AJAX source from `/kanban/get/1` (or `/kanban/get/0` for archive view).
- Columns: ID, Tile, Name, Start date (with overdue/highlight logic using moment.js), End date (with conditional colour coding), Status (badge), Actions (board link, edit, archive/restore).
- Column `end_date` colour coding:
  - Past & status < 4 → red
  - Within 7 days & status < 4 → yellow
  - Within 14 days & status < 4 → green
- Modal event handlers for archive/restore (populate hidden `#id` field).

#### `kanban_board.js`

- Initialises Bootstrap tooltips.
- Creates SortableJS instances on each `.task-list` UL. Draggable only on `.is-draggable` items.
- On drop (`onAdd`), POSTs to `/kanban/board/update/status` with `id` and `newStatus`.
- Delete modal handler populates `id` and `kanban_id` hidden fields.
- Auto-reloads the page every 5 minutes so boards stay reasonably current.

#### `edit_kanban.js`

- Initialises TinyMCE on `textarea#description` with image upload support.
- Custom file picker dialog fetches images from a server endpoint and inserts them.
- `dirty` (unsaved changes) warning via `warnUnsavedChanges('form')`.

#### `edit_kanban_tasks.js`

- Same TinyMCE setup applied to all `<textarea>` elements (description and remark).
- Image path targets `/public/images/tinymce/kanban/`.

---

## 7. Translations (`translations/translations.json`)

The module provides translations for English (base), Dutch, French, German, Spanish,
Italian, and Swedish.

The file structure:
```json
{
  "nl": {
    "Add Task": "Taak toevoegen",
    ...
  },
  "fr": { ... },
  "de": { ... },
  "es": { ... },
  "it": { ... },
  "sv": { ... }
}
```

Translations are loaded in `KanbanController::__construct()`:
```php
TRANSLATIONS->load(SYSTEM_ROOT . '/vendor/tigress/kanban-board/translations/translations.json');
```

The `__('word')` function looks up the word in the current language (derived from
`CONFIG->website->html_lang`). If not found, the original English word is returned.

---

## 8. Integration with the Host Application

### 8.1 Installation

```bash
composer require tigress/kanban-board
```

### 8.2 Required host setup

1. **Route merging:** The host's `Core` bootstrap must merge this module's routes
   (`vendor/tigress/kanban-board/config/routes.json`) into its routing table, OR
   the host copies the route entries into its own `config/routes.json`.

2. **Database tables:** The three tables (`kanbans`, `kanbans_statuses`,
   `kanbans_tasks`) must exist. This can be done via:
   - A migration script that runs `CREATE TABLE IF NOT EXISTS` statements.
   - Using `Tigress\SetupRepository` or the host's installation controller.
   - The `kanbans_statuses` table must be seeded with the status columns.

3. **Node dependencies** (for the host application):
   - `sortablejs` — drag-and-drop library (used on board page).
   - `tinymce` — rich text editor (used on edit pages).
   - These are expected at `node_modules/` relative to `BASE_URL`.

4. **Front-end serving:** Assets at `vendor/tigress/kanban-board/public/` are
   referenced via `{{ BASE_URL }}/vendor/tigress/kanban-board/public/...`. The
   host's web server must be configured to serve files from `vendor/` (or symlink
   the public assets).

### 8.3 Rights system

- Access level `100` is granted access by default.
- The right `'kanban'` is used as a `special_rights` key — the host application
  can assign read/write/delete permissions for the "kanban" tool to individual
  users via `RIGHTS->setSystemRights()`.

### 8.4 Custom Twig functions used

| Function | Source | Purpose |
|----------|--------|---------|
| `__()` | Tigress TranslationHelper | Translate a string |
| `attribute(obj, field)` | Twig core | Dynamic field access on stdClass |
| `in_values(needle, haystack)` | Tigress Twig custom | Check if needle is in JSON array string |

---

## 9. Architecture Patterns

### Repository Pattern

All data access goes through Repository classes. The pattern is:
1. `new Repo()` → connect to DB, auto-discover fields.
2. `$repo->loadById($id)` or `$repo->loadByWhere([...])` → populate internal objects.
3. `$repo->current()` → get the first (or current) model object.
4. Modify properties via `$model->property = value;`.
5. `$repo->save($model)` → auto-detect insert vs update.

### Controller Lifecycle

1. Route matched → Router instantiates controller and calls method.
2. Controller method checks rights (`$this->checkRights()` or `RIGHTS->checkRights()`).
3. Loads data via Repositories.
4. Calls `TWIG->render('template.twig', [...])` with template variables.
5. For CRUD: `$model->updateByPost($_POST)` → `$repo->save($model)` → `TWIG->redirect()`.

### Translation Flow

1. `TRANSLATIONS->load(path)` merges JSON file into in-memory dictionary.
2. `__('key')` looks up current 2-letter language code → dictionary → returns translation or key itself.
3. Twig templates use `{{ __('Key') }}` for UI text.
4. Language code is set by `CONFIG->website->html_lang` (which can be overridden by `$_SESSION['user']['locale']`).

---

## 10. Creating a Similar Module

To create a new Tigress module following this same pattern:

1. **`composer.json`** — Set PSR-4 autoloading for controllers, repositories, services.
2. **`config/routes.json`** — Define URL → controller/method mappings.
3. **`src/controllers/`** — Extend `Tigress\Controller`, use `TWIG->addPath()` and `TRANSLATIONS->load()` in the constructor.
4. **`src/repositories/`** — Extend `Tigress\Repository`, set `$table`, `$primaryKey`, `$softDelete`, `$createTable` (optional).
5. **`src/services/`** — Static helpers for reusable business logic.
6. **`src/views/`** — Twig templates extending `base.twig` or `datatable.twig`.
7. **`public/`** — CSS and JS assets referenced by `{{ BASE_URL }}/vendor/tigress/<package>/public/...`.
8. **`translations/translations.json`** — Multi-language strings.
9. **Host integration** — Routes must be merged, tables created, Node deps installed, assets served.
