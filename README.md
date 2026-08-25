# \# Songtinue

# 

# An AI-powered music layer generator with a Piano Roll editor.

# 

# \## Backend setup

# 

# The backend is built with Python and FastAPI.

# 

# \### Run the backend

# 

# From the `backend` directory:

# 

# ```powershell

# .\\.venv\\Scripts\\Activate.ps1

# python -m pip install -r requirements.txt

# python -m uvicorn app.main:app --reload

# ```

# 

# \### API documentation

# 

# When the server is running, open:

# 

# http://127.0.0.1:8000/docs

# 

# \### Current endpoints

# 

# \- `GET /health` checks whether the backend is running.

# \- `POST /song-ideas/validate` validates a song idea and parses its chord progression into bars.

