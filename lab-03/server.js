
const express = require("express");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Helper: send consistent error responses
function sendError(res, status, message) {
  return res.status(status).json({ message });
}

// GET all books with search, sorting, pagination and price filters
app.get("/books", (req, res) => {
  const {
    search_q = "",
    order_by = "title",
    order = "ASC",
    limit = "10",
    offset = "0",
    min_price,
    max_price
  } = req.query;

  // Validate sorting column
  const allowedColumns = ["id", "title", "author", "price", "pages"];

  if (!allowedColumns.includes(order_by)) {
    return sendError(res, 400, "Invalid order_by column.");
  }

  // Validate sort order
  const sortOrder = order.toUpperCase();

  if (!["ASC", "DESC"].includes(sortOrder)) {
    return sendError(res, 400, "order must be ASC or DESC.");
  }

  // Validate pagination
  const pageLimit = Number(limit);
  const pageOffset = Number(offset);

  if (!Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
    return sendError(res, 400, "limit must be between 1 and 100.");
  }

  if (!Number.isInteger(pageOffset) || pageOffset < 0) {
    return sendError(res, 400, "offset must be a non-negative integer.");
  }

  // Validate price filters
  if (
    (min_price !== undefined && !Number.isFinite(Number(min_price))) ||
    (max_price !== undefined && !Number.isFinite(Number(max_price)))
  ) {
    return sendError(res, 400, "Price filters must be numeric.");
  }

  if (
    min_price !== undefined &&
    max_price !== undefined &&
    Number(min_price) > Number(max_price)
  ) {
    return sendError(res, 400, "min_price cannot exceed max_price.");
  }

  let sql = "SELECT * FROM book WHERE title LIKE ?";
  const params = [`%${search_q}%`];

  if (min_price !== undefined) {
    sql += " AND price >= ?";
    params.push(Number(min_price));
  }

  if (max_price !== undefined) {
    sql += " AND price <= ?";
    params.push(Number(max_price));
  }

  // order_by and order are validated against allowed values
  sql += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(pageLimit, pageOffset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      return sendError(res, 500, "Failed to retrieve books.");
    }

    res.status(200).json(rows);
  });
});

// GET book by ID
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, "Invalid book ID.");
  }

  db.get("SELECT * FROM book WHERE id = ?", [id], (err, book) => {
    if (err) return sendError(res, 500, "Database error.");
    if (!book) return sendError(res, 404, "Book not found.");

    res.status(200).json(book);
  });
});

// POST create a book
app.post("/books", (req, res) => {
  const { title, author, price, pages } = req.body;

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof author !== "string" ||
    author.trim() === ""
  ) {
    return sendError(res, 400, "Title and author are required.");
  }

  if (price === undefined || price === null || price === "" ||
      !Number.isFinite(Number(price))) {
    return sendError(res, 400, "Price must be a numeric value.");
  }

  if (Number(price) < 0) {
    return sendError(res, 400, "Price cannot be negative.");
  }

  db.run(
    "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
    [title.trim(), author.trim(), Number(price), pages ?? null],
    function (err) {
      if (err) return sendError(res, 500, "Failed to create book.");

      res.status(201).json({
        message: "Book created successfully.",
        id: this.lastID
      });
    }
  );
});

// PUT update a book
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, author, price, pages } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, "Invalid book ID.");
  }

  if (
    typeof title !== "string" || title.trim() === "" ||
    typeof author !== "string" || author.trim() === ""
  ) {
    return sendError(res, 400, "Title and author are required.");
  }

  if (price === undefined || price === null || price === "" ||
      !Number.isFinite(Number(price))) {
    return sendError(res, 400, "Price must be numeric.");
  }

  if (Number(price) < 0) {
    return sendError(res, 400, "Price cannot be negative.");
  }

  db.run(
    `UPDATE book
     SET title = ?, author = ?, price = ?, pages = ?
     WHERE id = ?`,
    [title.trim(), author.trim(), Number(price), pages ?? null, id],
    function (err) {
      if (err) return sendError(res, 500, "Failed to update book.");
      if (this.changes === 0) return sendError(res, 404, "Book not found.");

      res.status(200).json({ message: "Book updated successfully." });
    }
  );
});

// DELETE a book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, 400, "Invalid book ID.");
  }

  db.run("DELETE FROM book WHERE id = ?", [id], function (err) {
    if (err) return sendError(res, 500, "Failed to delete book.");
    if (this.changes === 0) return sendError(res, 404, "Book not found.");

    res.status(200).json({ message: "Book deleted successfully." });
  });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendError(res, 400, "Invalid JSON body.");
  }

  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
