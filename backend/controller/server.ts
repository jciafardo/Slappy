import express, { Request, Response } from 'express';
import AUTHORIZE from '../authenticate';
import {getFileContent, createFolder, createFile, writeFileContent, clearFileContent} from '../drive';
import cors from 'cors';


const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(cors());


// Middleware to parse JSON bodies
app.use(express.json());

// Define an API endpoint
app.get('/getAllCopiedText', async (req: Request, res: Response) => {
  
  const oauthClient = await AUTHORIZE();
  const fileId = await createFile(oauthClient, await createFolder(oauthClient));
  const fileContent = await getFileContent(oauthClient, fileId)
  res.json(fileContent);
});

app.post('/createFileAndFolder', async (req: Request, res: Response) => {
  const oauthClient = await AUTHORIZE();
  const folderId = await createFolder(oauthClient)
  res.json(folderId);
});

app.put('/addCopiedText', async (req: Request, res: Response) => {
  console.log(req.body)
  const { label, value } = req.body; // Get sensitive data from the request body

  if (!label || !value) {
    return res.status(400).json({ error: 'Label and value are required.' });
  }

  try {
    // Authorize and perform operations
    const oauthClient = await AUTHORIZE();
    const folderId = await createFolder(oauthClient);
    const fileId = await createFile(oauthClient, folderId);

    // Await the writeFileContent operation to ensure it completes
    await writeFileContent(oauthClient, fileId, label, value);

    // Send a successful response
    res.json({ message: 'Text added successfully', folderId, fileId });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error('Error during processing:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.put('/deleteCopiedText', async (req: Request, res: Response) => {
  try {
    const oauthClient = await AUTHORIZE();
    const folderId = await createFolder(oauthClient);
    const fileId = await createFile(oauthClient, folderId);
    await clearFileContent(oauthClient, fileId);
    res.json({ message: 'File content cleared successfully', folderId, fileId });
  } catch (error) {
    console.error('Error during processing:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});





// Start the server
function startServer(){
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });
}

export default startServer;

