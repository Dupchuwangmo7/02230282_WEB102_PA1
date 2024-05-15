# Node.js HTTP Server
This is a simple HTTP server built with Node.js that provides CRUD (Create, Read, Update, Delete) functionality for a collection of products.

### Installation
First, Clone this repository to your local machine.
Second, Navigate to the project directory in your terminal.
Last, Run npm install to install the required dependencies.
### Usage
- After installing dependencies, start the server by running `node server.js`.
- The server will start listening on port 3000 by default. 
- Use a tool like Postman or cURL to send HTTP requests to interact with the server.

### Endpoints
GET /api/products
- This retrieves a list of all products.
GET /api/products/{id}
- Retrieves details of a specific product by ID.
POST /api/products
- Adds a new product to the collection.
PUT /api/products/{id}
- Updates an existing product with new data.
PATCH /api/products/{id}
- Updates specific fields of an existing product.
DELETE /api/products/{id}
- Deletes a product from the collection.

### Data Format
Product data is stored in a JSON file located at ./data/products.json. 
    {
      "id": 1,
      "name": "Product Name",
      "price": 10.99,
      "description": "Product Description"
    }
Reference 
- https://www.youtube.com/watch?v=_1xa8Bsho6A&t=1185s
