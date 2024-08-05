import express, { Request, Response } from 'express';
import AUTHORIZE from '../authenticate';
import GET_FILES from '../drive';

const fileId: string = '1kVhipG5toxecytfgJexRX_4ssvz6XldW';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define an API endpoint
app.get('/getAllCopiedText', (req: Request, res: Response) => {
  const responseData = {
    "start": "end"
  };
  res.json(responseData);
});

// Start the server
function startServer(){
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
}

export default startServer;

