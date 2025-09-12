# **MC Poll System API (Django + DRF)**
* Backend for **MC Poll System** — a production-style polling API with polls, options, voting, JWT auth, CORS, and Swagger docs.

**Project by**: Muluvhu Clearence Mpho (ALX – ProDev Backend)
Tech: Django, Django REST Framework, SimpleJWT, django-filter, drf-spectacular

---
## ✨ Features
- **Polls & Options** CRUD
- **Voting system with duplicate prevention**
- **Real-time results calculation**
- **JWT authentication** (access/refresh)
- **Swagger** / ReDoc interactive docs
- **CORS** enabled for frontend integration
- **Seeder**: demo polls with sample options

---
## 🚀 Quick Start
```bash
# 1) Activate your venv (example)
source .venv/bin/activate

# 2) Install dependencies
pip install -r requirements.txt
# (or)
pip install django djangorestframework djangorestframework-simplejwt django-filter drf-spectacular django-cors-headers

# 3) Run migrations
python manage.py migrate

# 4) Create admin (optional)
python manage.py createsuperuser

# 5) Seed demo data
python manage.py seed_demo --wipe --count 5

# 6) Start the server
python manage.py runserver
```
---

## 🔗 Endpoints
### Docs

- **Swagger UI:** `GET /api/docs/`
- **ReDoc:** `GET /api/redoc/`
- **OpenAPI JSON:** `GET /api/schema/`

---

### Auth (JWT)

- **Obtain token:** `POST /api/auth/token/`
- **Refresh token:** `POST /api/auth/token/refresh/`

**Request**

```json
POST /api/auth/token/
{
  "username": "admin",
  "password": "yourpassword"
}
```

**Response**

```json
{
  "access": "<JWT_ACCESS>",
  "refresh": "<JWT_REFRESH>"
}
```
**Use the token in requests:**

```http
Authorization: Bearer <JWT_ACCESS>
```

> Note: Poll endpoints are public (AllowAny) by default. To restrict writes, switch to IsAuthenticatedOrReadOnly in the viewsets.
---
### Categories

- `GET /api/polls/ ` — list all polls
- `POST /api/polls/` — create a new poll
- `GET /api/polls/{id}/` — retrieve a specific poll
- `PUT /api/polls/{id}/` — update a poll
- `DELETE /api/polls/{id}/` — delete a poll 

```bash
curl http://127.0.0.1:8000/api/polls/
```
**Create**

```bash
curl -X POST http://127.0.0.1:8000/api/polls/ \
  -H "Content-Type: application/json" \
  -d '{"question":"Favorite programming language?","options":["Python","JavaScript","Java"],"expires_at":"2023-12-31T23:59:59Z"}'
```

---
### Voting 
- ```POST /api/polls/{id}/vote/``` — cast a vote

```json
{
  "id": 1,
  "question": "Favorite programming language?",
  "options": [
    {"id": 1, "text": "Python", "vote_count": 42},
    {"id": 2, "text": "JavaScript", "vote_count": 35},
    {"id": 3, "text": "Java", "vote_count": 28}
  ],
  "total_votes": 105,
  "created_at": "2023-08-10T12:34:56Z",
  "expires_at": "2023-12-31T23:59:59Z"
}
```
## 🔍 Query Parameters (Products)

- **Search:** `?search=programming` (matches question text)
- **Filter by status `?status=active:`** (active/expired)
- **Ordering:**
  - `?ordering=created_at` (oldest_first)
  - `?ordering=created_at` (newest_first)
  - `?ordering=total_votes` (least popular first)
  - `?ordering=-total_votes` (most popular first)
  - supports `created_at`, `name`
- **Pagination:** `?page=2` (page size is **10** by default)
**Examples**

```bash
/api/polls/?search=technology
/api/polls/?status=active&ordering=-created_at
/api/polls/?ordering=-total_votes
/api/polls/?page=2
```
**Pagination shape**

```json
{
  "count": 25,
  "next": "http://127.0.0.1:8000/api/polls/?page=2",
  "previous": null,
  "results": [
    /* array of polls */
  ]
}
```

---
## 🌱 Seeding

Create sample polls with options:

```bash
python manage.py seed_demo --wipe --count 5
```

Remove all demo data:

```bash
python manage.py clear_demo
```

---
## 🧩 CORS (Frontend Integration)

CORS is enabled for local development:

```python
# config/settings.py
CORS_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8000",
]
```

Your frontend can call:

```http
GET http://127.0.0.1:8000/api/polls/?ordering=-created_at
```

---
## 🗂 Project Structure

```
config/
  settings.py      # DRF, JWT, CORS, Swagger config
  urls.py          # routers + docs + auth
polls/
  models.py        # Poll, Option, Vote
  serializers.py   # PollSerializer, OptionSerializer, VoteSerializer
  views.py         # ViewSets with search/filter/order/pagination
  admin.py         # Admin registration
  management/
    commands/
      seed_demo.py # seed demo data
      clear_demo.py
```

---
## 🛡️ Voting Validation

- The system prevents duplicate voting by:
- Checking voter_id against existing votes for each poll
- Using IP address hashing as fallback identification
- Allowing configurable voting restrictions
---

## 🧪 Quick cURL Tests

**List polls (newest first)**

```bash
curl "http://127.0.0.1:8000/api/polls/?ordering=-created_at"
```

**Create a poll**

```bash
curl -X POST http://127.0.0.1:8000/api/polls/ \
  -H "Content-Type: application/json" \
  -d '{"question":"Best web framework?","options":["Django","Flask","FastAPI"],"expires_at":"2023-12-31T23:59:59Z"}'
```

**Cast a vote**

```bash
curl -X POST http://127.0.0.1:8000/api/polls/1/vote/ \
  -H "Content-Type: application/json" \
  -d '{"option_id": 2, "voter_id": "user123"}'
```
**Get results**
```bash
curl http://127.0.0.1:8000/api/polls/1/results/
```
**Obtain JWT** 
```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpass"}'
```

---
## 🛠 Troubleshooting

- **You must set `settings.ALLOWED_HOSTS` if `DEBUG` is False**  
  Set `DEBUG = True` during development, or add your host to `ALLOWED_HOSTS`.

- **SECRET_KEY must not be empty**  
  Ensure `SECRET_KEY` is set in `config/settings.py`.

- **CORS errors in the browser**  
  Add your frontend origin (port) to `CORS_ALLOWED_ORIGINS`.

- **No data showing**  
  Run the seeder:
  ```bash
  python manage.py seed_demo --wipe --count 5
  ```
- **Duplicate vote error**
  Ensure you're using a unique voter_id for each vote per poll.

---

## 📄 License

MIT (or your preferred license)

---

## 📣 Credits

Built by **Muluvhu Clearence Muluvhu** for **ALX ProDev Backend (Project Nexus)**.  



