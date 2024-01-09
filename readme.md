# Django JWT Authentication Project

This is a basic Django project that includes user authentication using JWT (JSON Web Tokens) with Django Rest Framework.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Python (3.6 or higher)
- pip (package installer for Python)
- Node.js and npm (or Yarn)

### Installation-(Backend)

1. Clone the repository:

    ```bash
    git clone https://github.com/rmrajesofficial/Authentication.git
    ```

2. Navigate to the project directory:

    ```bash
    cd backend
    ```

3. Create a virtual environment:

    ```bash
    python -m venv venv
    ```

4. Activate the virtual environment:

    - On Windows:

        ```bash
        venv\Scripts\activate
        ```

    - On Unix or MacOS:

        ```bash
        source venv/bin/activate
        ```

5. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

6. Apply database migrations:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
7. Start the development server:

     ```bash
    python manage.py runserver
    ```

### Installation-(Frontend)

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install dependencies using npm:

    ```bash
    npm install
    ```

   or using yarn:

    ```bash
    yarn install
    ```

### Running the Frontend

Start the frontend development server:

- Using npm:

    ```bash
    npm start
    ```

- Using yarn:

    ```bash
    yarn start
    ```

The frontend development server will be accessible at [http://localhost:3000](http://localhost:3000).



