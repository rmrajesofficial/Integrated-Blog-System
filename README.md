# Enhanced Authentication System with Integrated Blog and Appointment Booking Functionality

This repository contains the degradation of the project 'Authentication'. The primary objective of this project is to enhance the existing application by integrating a blog system. With this new feature, doctors will have the ability to create and upload insightful blog posts, while patients can easily view and engage with the content. Additionally, to further streamline the healthcare experience, patients can now conveniently book appointments through the application. Once a doctor accepts an appointment, the details will be seamlessly saved in the Google Calendar as events, ensuring efficient scheduling and improved coordination between healthcare providers and patients.

## Getting Started

Previous Project : https://github.com/rmrajesofficial/Authentication.git

Follow these instructions to set up and run the project on your local machine.

#### Frontend is uploaded on master branch

### Prerequisites

- Python (3.6 or higher)
- pip (package installer for Python)
- Node.js and npm (or Yarn)

- create Google Cloud Platform (GCP) account
- enable Google Calendar API in GCP
- create a service account
- download Service account JSON key file with Calendar API access
- give role/permissions like owner, editor, API admin etc
- share your primary calender with your Service account with necessary permissions like (make changes and manage sharing)
- save your json file in /backend/User
- change the folowing lines (202,210) in views.py

### Installation-(Backend)

1. Clone the repository:

   ```bash
   git clone https://github.com/rmrajesofficial/Integrated-Blog-System.git
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
