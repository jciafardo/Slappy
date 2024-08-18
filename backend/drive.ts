import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import AUTHORIZE from './authenticate';

export async function getFileContent(authClient: OAuth2Client, fileId: string): Promise<object> {
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
    
    console.error('Error retrieving file content:', error);
    return JSON.parse('{"fileReadingError": "Cannot read text from file... copy some text to create a fresh slappy"}');
  }
}

async function writeFileContent(){
  
}

export async function createFile(authClient: OAuth2Client, parentFolderId: string): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const fileName = 'slappy.txt';

  // Check if a file with the same name already exists in the folder
  try {
    const existingFileResponse = await drive.files.list({
      q: `name = '${fileName}' and '${parentFolderId}' in parents and trashed = false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    const existingFiles = existingFileResponse.data.files;

    if (existingFiles && existingFiles.length > 0) {
      // If a file with the same name exists, return its ID
      console.log('File already exists. File Id:', existingFiles[0].id);
      return existingFiles[0].id || '';
    }

    // If no file exists, proceed to create a new one
    const fileMetadata = {
      name: fileName, // Name of the file with .txt extension
      mimeType: 'text/plain', // MIME type for a text file
      parents: [parentFolderId],
    };

    const media = {
      mimeType: 'text/plain', // MIME type matching the content type
      body: '{}', // Content of the file
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media, // Attach the media object for file content
      fields: 'id', // Specify the fields to be returned in the response
    });

    const fileId = response.data.id; // Retrieve the file ID from the response

    if (typeof fileId === 'string') {
      console.log('Created new file. File Id:', fileId);
      return fileId; // Returns the file ID as a string
    } else {
      // Handle unexpected response data format
      throw new Error('Failed to retrieve the file ID');
    }
  } catch (err) {
    // Handle any errors that occur during the file creation process
    console.error('Error creating or checking file:', err);
    throw err;
  }
}

// create a folder named slappy, this fucntion also calls createFile() once a file is created
export async function createFolder(authClient: OAuth2Client): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const folderName = 'Slappy';

  // Check if folder already exists
  const existingFolderId = await findFolderId(drive, folderName);

  if (existingFolderId) {
    // Folder already exists, return the existing folder ID
    console.log('Folder already exists. Folder Id:', existingFolderId);
    createFile(authClient, existingFolderId)
    return existingFolderId;
  }

  // Folder does not exist, create a new one
  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    const folderId = response.data.id;

    if (typeof folderId === 'string') {
      console.log('Created new folder. Folder Id:', folderId);
      await createFile(authClient, folderId)
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

// Function to search for existing folders
async function findFolderId(drive: drive_v3.Drive, folderName: string): Promise<string | null> {
  try {
    const response = await drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'  and trashed = false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    const folders = response.data.files;

    if (folders && folders.length > 0) {
      // Return the ID of the first found folder with the given name
      return folders[0].id || null;
    }

    // No folder found
    return null;
  } catch (err) {
    console.error('Error searching for folder:', err);
    throw err;
  }
}



