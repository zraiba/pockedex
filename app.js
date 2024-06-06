const express= require('express');
const path = require("path");
const fs = require("fs");
const port=3000;
const app = express();
const routersPath = path.join(__dirname, "routes");

//Dynamically import all routes
fs.readdirSync(routersPath).forEach((file) => {
    if (file.endsWith(".js")) {
      const routerModule = require(path.join(routersPath, file));
      const router = routerModule.router;
      app.use(router);
    }
  });

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });