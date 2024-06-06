# POKEDEX

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Docker](#docker)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the project dependencies, run:

\`\`\`bash
npm install
\`\`\`

## Usage

To run the project locally, execute:

\`\`\`bash
npm start
\`\`\`

This will start the server, and you can access it at \`http://localhost:3000\`.

## Docker

### Building the Docker image

To build the Docker image, use the following command:

\`\`\`bash
docker build -t pokedex:1.0 .
\`\`\`

### Running the Docker container

After building the Docker image, you can run it with:

\`\`\`bash
docker run -p 3000:3000 pokedex:1.0
\`\`\`

This will start the container and expose the application on port 3000.

## Running Tests

[Jest](https://jestjs.io/) is used for testing. To run tests, execute:

\`\`\`bash
npm test
\`\`\`

This will run all the tests in your project.

## Technologies Used

- Node.js
- Express.js
- Docker
- Jest

