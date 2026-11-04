
# Backend Development Fundamentals – Lab 3

## Student Details

- **Name:** D. Mahesh
- **Registration Number:** 252U1R9034
- **GitHub Username:** [dm2571984-byte](https://github.com/dm2571984-byte)
- **Section:** CSE (Gen-AI) 2A
- **Course:** Backend Development Fundamentals

---
## Screenshots

## Screenshots

### Server Running
![Server](screenshots/Screenshot%202026-11-04%20191508.png)

### Create Book
![Create Book](screenshots/Screenshot%202026-11-04%20191545.png)

### Get Books
![Get Books](screenshots/Screenshot%202026-11-04%20191638.png)

### API Testing
![API Testing](screenshots/Screenshot%202026-11-04%20191707.png)

### Additional API Test
![Additional Test](screenshots/Screenshot%202026-11-04%20191756.png)

### Validation
![Validation](screenshots/Screenshot%202026-11-04%20191855.png)
### Validation Errors
![Validation](screenshots/validation-title.png)
![Invalid Price](screenshots/validation-price.png)
# Backend Development Fundamentals – Lab 3

## Student Details
- Name: D. Mahesh
- Registration Number: 252U1R9034
- Section: S-24
- Course: CSE Gen-AI
- University: Aurora Deemed to be University

## Lab Title
REST API Development with Query Parameters, Validation, and Debugging

## Objective
To develop a REST API using Node.js, Express.js, and SQLite with CRUD operations, query parameters, validation, and error handling.

## Technologies
Node.js, Express.js, SQLite, JavaScript, PowerShell

## Installation and Execution
1. Install Node.js.
2. Open the lab-03 folder in VS Code.
3. Run `npm install`.
4. Start the server using `node server.js`.
5. Server URL: `http://localhost:3001`

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /books | Retrieve books |
| GET | /books/:id | Retrieve one book |
| POST | /books | Create a book |
| PUT | /books/:id | Update a book |
| DELETE | /books/:id | Delete a book |

## Query Parameters
- `search_q`: Search by title
- `order_by`: Sort column
- `order`: ASC or DESC
- `limit`: Pagination limit
- `offset`: Pagination offset
- `min_price`, `max_price`: Price filtering

## Validation and Error Handling
- Validates title, author, and price.
- HTTP 400 for invalid input.
- HTTP 404 for missing books.
- HTTP 201 for successful creation.
- JSON error responses.

## Testing
Tested locally using PowerShell HTTP requests.

## Deployment
The API has been tested locally and is not deployed publicly.

## Conclusion
This lab helped me learn REST API development, CRUD operations, query parameters, SQLite integration, validation, and debugging.