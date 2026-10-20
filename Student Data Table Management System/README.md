Student Data Table Management System
A REST API for managing student records, built with Node.js, Express.js, MongoDB, and Mongoose. The API supports CRUD operations, searching, sorting, filtering, and pagination. You can test all endpoints inside VS Code using Thunder Client.
Features
- Display all student records
- Get a single student by MongoDB ID
- Add, update, and delete student records
- Search students by name or email
- Sort students by name in ascending (A–Z) or descending (Z–A) order
- Filter students by city or category
- Paginate results with 5 or 10 records per page
- Validate required fields and handle duplicate email addresses
- Test REST API endpoints using Thunder Client in VS Code
Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- CORS
- Nodemon
- Thunder Client (API testing)
Project Structure
student-data-table/
├── controllers/
│   └── studentController.js
├── models/
│   └── Student.js
├── routes/
│   └── studentRoutes.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
Prerequisites
Install or prepare the following before starting:
- Node.js
- MongoDB running locally, or a MongoDB Atlas cluster
- Visual Studio Code
- Thunder Client extension in VS Code (for API testing)
Installation
1. Clone or open the project
If you already created the project, open its folder in VS Code and open the integrated terminal.

To create a new project folder:
mkdir student-data-table
cd student-data-table
npm init -y
2. Install dependencies
npm install express mongoose dotenv cors
npm install --save-dev nodemon
3. Configure package.json
Ensure "type": "module" and these scripts are present. Keep the dependencies installed by npm.
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
4. Configure environment variables
Create a .env file in the project's root directory.

For a local MongoDB instance:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/studentDB
For MongoDB Atlas, replace the example MONGO_URI with your own Atlas connection string. Make sure the database user and network access are configured in Atlas.

Security: Never commit .env or expose your database credentials.
5. Start the server
npm run dev
When the database connection succeeds, the terminal should show messages similar to:
MongoDB connected successfully
Server running at http://localhost:5000
Open http://localhost:5000 to check the basic health route.
Student Schema
Each student record contains these fields:
Field	Type	Required	Description
name	String	Yes	Student's full name
email	String	Yes	Student's email; unique
phone	String	Yes	Contact number
city	String	Yes	Student's city
category	String	Yes	Course or category
createdAt	Date	Automatic	Record creation time
updatedAt	Date	Automatic	Last update time


API Endpoints
Base URL:
http://localhost:5000/api/students
Method	Endpoint	Description
GET	/api/students	Get student list
GET	/api/students/:id	Get one student by ID
POST	/api/students	Add a student
PUT	/api/students/:id	Update a student
DELETE	/api/students/:id	Delete a student


Search, Sorting, Filtering, and Pagination
Query parameters can be combined in one request.
Feature	Example
Search by name or email	/api/students?search=Rahul
Sort A–Z by name	/api/students?sort=asc
Sort Z–A by name	/api/students?sort=desc
Filter by city	/api/students?city=Surat
Filter by category	/api/students?category=Full%20Stack
Page 1, 5 records	/api/students?page=1&limit=5
Page 2, 10 records	/api/students?page=2&limit=10
Combine query parameters	/api/students?search=Rahul&city=Surat&sort=asc&page=1&limit=10


Pagination accepts limit=5 or limit=10. The search checks both the student's name and email. City and category filters are case-insensitive exact matches.
Test with Thunder Client in VS Code
1. Install Thunder Client from the VS Code Extensions panel (Ctrl + Shift + X).
2. Start the server using npm run dev.
3. Open Thunder Client and choose New Request.
4. Select the HTTP method, enter the URL, and click Send.
5. For POST and PUT requests, choose Body → JSON and enter the request body.
1. Check the API
- Method: GET
- URL: http://localhost:5000/
Expected response:
{
  "success": true,
  "message": "Student Data Table API is running"
}
2. Add a student
- Method: POST
- URL: http://localhost:5000/api/students
- Body type: JSON
{
  "name": "Rahul Patel",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "city": "Surat",
  "category": "Full Stack"
}
A successful request returns 201 Created and the saved student, including its MongoDB _id.
3. Get all students
- Method: GET
- URL: http://localhost:5000/api/students
4. Get one student
- Method: GET
- URL: http://localhost:5000/api/students/STUDENT_ID
Replace STUDENT_ID with the actual _id returned by MongoDB.
5. Update a student
- Method: PUT
- URL: http://localhost:5000/api/students/STUDENT_ID
- Body type: JSON
{
  "name": "Rahul Patel",
  "email": "rahul@example.com",
  "phone": "9999999999",
  "city": "Ahmedabad",
  "category": "Frontend"
}
6. Delete a student
- Method: DELETE
- URL: http://localhost:5000/api/students/STUDENT_ID
Replace STUDENT_ID with the real MongoDB document ID. A successful request returns a confirmation message.
Common Errors
MONGO_URI is missing in .env
- Confirm .env is in the project root, next to server.js.
- Confirm the variable is named exactly MONGO_URI.
- Save the file and restart the server.
MongoDB connection error
- For local MongoDB, make sure the MongoDB service is running.
- For Atlas, check the connection string, database credentials, and Network Access settings.
Email already exists
The email must be unique. Try another email address or use the existing student's ID to update that record.
Invalid student ID
Use the actual MongoDB _id, not the student's name or email.
Route not found
Check the HTTP method and URL, including the /api/students prefix.
Git Ignore
The .gitignore file should contain:
node_modules/
.env
Future Improvements
- Build a React frontend with a student data table
- Add form validation for email and phone
- Add authentication and role-based access
- Add automated API tests
- Add export to CSV functionality
Author
Yash Kumar
This project is intended for learning REST API development with Node.js, Express.js, and MongoDB.