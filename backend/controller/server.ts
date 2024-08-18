import express, { Request, Response } from 'express';
import AUTHORIZE from '../authenticate';
import {getFileContent, createFolder} from '../drive';
import cors from 'cors';

const fileId: string = '13b2-PMA7gbfMFbFviU4cqVLyLSfzYiZ3';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(cors());

// Define an API endpoint
app.get('/getAllCopiedText', async (req: Request, res: Response) => {
  const oauthClient = await AUTHORIZE();
  const fileContent = await getFileContent(oauthClient, fileId)
  res.json(fileContent);
});

app.get('/createFileAndFolder', async (req: Request, res: Response) => {
  const oauthClient = await AUTHORIZE();
  const folderId = await createFolder(oauthClient)
  res.json(folderId);
});




// Start the server
function startServer(){
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
}

export default startServer;

