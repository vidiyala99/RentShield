# RentShield - NC Tenant Rights Copilot

RentShield is a web application designed to empower North Carolina renters by helping them understand their legal rights and generate formal demand letters for common housing issues.

## Features

- **Scenario-Based Guidance**: Interactive flows for "Repairs & Maintenance" and "Security Deposits".
- **Legal Education**: Cites specific NC General Statutes (e.g., § 42-42, § 42-52) to educate tenants.
- **Automated Letter Generation**: customized PDF-ready demand letters based on user inputs.
- **Privacy-First**: No personal data (names, addresses) is stored on the server.
- **Print-Friendly**: Clean, professional layout for printing letters directly from the browser.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: FastAPI, SQLAlchemy, SQLite, Jinja2
- **Styling**: Vanilla CSS (Custom "Clean Premium" Design System)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/rentshield.git
    cd rentshield
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    # source venv/bin/activate
    
    pip install -r requirements.txt
    
    # Initialize Database
    alembic upgrade head
    python seed.py
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

You can use the provided helper script to run both servers (Windows):

```powershell
./start_dev.ps1
```

Or run them manually:

- **Backend**: `uvicorn app.main:app --reload --port 8000` (inside `backend` dir)
- **Frontend**: `npm run dev` (inside `frontend` dir)

Access the app at `http://localhost:5173`.

## Disclaimer

**RentShield is not a law firm.** The information provided by this application is for educational purposes only and does not constitute legal advice. Usage of this tool does not create an attorney-client relationship. Laws vary by jurisdiction and are subject to change. Always consult with a qualified attorney for advice on your specific legal situation.

## License

MIT
