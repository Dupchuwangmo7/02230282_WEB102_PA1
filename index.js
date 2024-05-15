const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/products" && req.method === "GET") {
    try {
      const storageFile = await fs.readFile("./data/products.json");
      const data = JSON.parse(storageFile);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error retrieving products" }));
    }
  } else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "GET") {
    const id = req.url.split('/')[3]; 
    try {
      const storageFile = await fs.readFile("./data/products.json");
      const products = JSON.parse(storageFile);
      const product = products.find(p => p.id === id); 
      if (!product) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Product not found" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(product));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error retrieving product" }));
    }
  } else if (req.url === "/api/products" && req.method === "POST") {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', async () => {
      try {
        const newProduct = JSON.parse(body);
        const storageFile = await fs.readFile("./data/products.json");
        const products = JSON.parse(storageFile);
        newProduct.id = products.length + 1; // Assign a unique ID
        products.push(newProduct);
        await fs.writeFile("./data/products.json", JSON.stringify(products, null, 2));
        
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newProduct));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error parsing or saving new product" }));
      }
    });
  } else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "PUT") {
    const id = req.url.split('/')[3];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', async () => {
      try {
        const updatedProduct = JSON.parse(body);
        const storageFile = await fs.readFile("./data/products.json");
        let products = JSON.parse(storageFile);
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Product not found" }));
        } else {
          products[index] = { ...products[index], ...updatedProduct };
          await fs.writeFile("./data/products.json", JSON.stringify(products, null, 2));

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(products[index]));
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error parsing or updating product" }));
      }
    });
  } else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "PATCH") {
    const id = req.url.split('/')[3];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', async () => {
      try {
        const updatedFields = JSON.parse(body);
        const storageFile = await fs.readFile("./data/products.json");
        let products = JSON.parse(storageFile);
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Product not found" }));
        } else {
          // Update only the specified fields
          for (let key in updatedFields) {
            if (products[index][key] !== undefined) {
              products[index][key] = updatedFields[key];
            }
          }
          await fs.writeFile("./data/products.json", JSON.stringify(products, null, 2));

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(products[index]));
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error parsing or updating product" }));
      }
    });
  } else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "DELETE") {
    const id = req.url.split('/')[3];
    try {
      const storageFile = await fs.readFile("./data/products.json");
      let products = JSON.parse(storageFile);
      const index = products.findIndex(p => p.id === id);

      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Product not found" }));
      } else {
        products.splice(index, 1);
        await fs.writeFile("./data/products.json", JSON.stringify(products, null, 2));

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Product deleted successfully" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error deleting product" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route Not Found" }));
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
