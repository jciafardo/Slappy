import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import AUTHORIZE from './authenticate';

async function getFileContent(authClient: OAuth2Client, fileId: string): Promise<object> {
  const drive = google.drive({ version: 'v3', auth: authClient });

  try {

    // Retrieve the file content as text
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media' // Use 'media' to get the file content
    }, { responseType: 'text' });
    
    const fileData = JSON.parse("" + response.data);
    
    // Return file data as a json object
    return fileData;
  } catch (error) {
    // add a check if we have a folder named slappy
    createFolder(authClient)
    createFile(authClient)
    console.error('Error retrieving file content:', error);
    return JSON.parse('{"fileReadingError": "Cannot read text from file... copy some text to create a fresh slappy"}');
  }
}

async function writeFileContent(){

}

async function createFile(authClient: OAuth2Client){
  const drive = google.drive({ version: 'v3', auth: authClient });

const fileMetadata = {
  name: 'slappy.txt', // Name of the file with .txt extension
  mimeType: 'text/plain', // MIME type for a text file
};

const media = {
  mimeType: 'text/plain', // MIME type matching the content type
  body: 'content of the file', // Content of the file
};

try {
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media, // Attach the media object for file content
    fields: 'id', // Specify the fields to be returned in the response
  });
  
  const fileId = response.data.id; // Retrieve the file ID from the response
  
  if (typeof fileId === 'string') {
    console.log('File Id:', fileId);
    return fileId; // Returns the file ID as a string
  } else {
    // Handle unexpected response data format
    throw new Error('Failed to retrieve the file ID');
  }
} catch (err) {
  // Handle any errors that occur during the file creation process
  console.error('Error creating file:', err);
  throw err;
}
}

async function createFolder(authClient: OAuth2Client): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const fileMetadata = {
    name: 'Slappy',
    mimeType: 'application/vnd.google-apps.folder',
  };
  
  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });
    
    const folderId = response.data.id;
    
    if (typeof folderId === 'string') {
      console.log('Folder Id:', folderId);
      return folderId; // Returns the folder ID as a string
    } else {
      // Handle unexpected response data format
      throw new Error('Failed to retrieve the folder ID');
    }
  } catch (err) {
    // Handle error
    console.error('Error creating folder:', err);
    throw err;
  }
}


export default getFileContent;
