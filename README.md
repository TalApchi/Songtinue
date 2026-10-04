# Songtinue
# Songtinue

An AI-powered music layer generator with a Piano Roll editor.

## Screenshots

### Main screen
![Songtinue main screen](./main-screen.png)

### Application preview
![Songtinue preview 1](./1.png)

![Songtinue preview 2](./2.png)

## Backend setup

The backend is built with Python and FastAPI.

### Run the backend

From the `backend` directory:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### API documentation

http://127.0.0.1:8000/docs

### Current endpoints

- `GET /health`: Checks whether the backend is running.
- `POST /song-ideas/validate`: Validates a song idea and parses its chord progression into bars.
From the `backend` directory, activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies and start the server:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### API documentation

When the server is running, open:

http://127.0.0.1:8000/docs

### Current endpoints

- `GET /health` — Checks whether the backend is running.
- `POST /song-ideas/validate` — Validates a song idea and parses its chord progression into bars.
