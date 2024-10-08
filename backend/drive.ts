import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';


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
    
    await clearFileContent(authClient, fileId)
    return JSON.parse('{"fileReadingError": "Cannot read text from file... copy some text to create a fresh slappy"}');
  }
}

export async function writeFileContent(authClient: OAuth2Client, fileId: string, textLabel: string, textValue: string) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  try {
    // Retrieve the existing content of the file
    const fileResponse = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    }, { responseType: 'text' });

    let existingContent: Record<string, any> = {};

    try {
      // Parse existing content as JSON
      existingContent = JSON.parse(fileResponse.data as string);
    } catch {
      // If parsing fails, assume content is not valid JSON and clear the file
      console.warn('Existing content is not valid JSON, clearing file content.');
      await clearFileContent(authClient, fileId);

      // Initialize existing content as an empty object
      existingContent = {};
    }

    // Update the JSON object with the new data
    existingContent[textLabel] = textValue;

    // Convert the updated JSON object to a string
    const newContent = JSON.stringify(existingContent, null, 2);

    // Update the file with the new JSON content
    const media = {
      mimeType: 'application/json',
      body: newContent,
    };

    const updateResponse = await drive.files.update({
      fileId: fileId,
      media: media,
    });

    console.log('File content updated successfully', updateResponse.status);
  } catch (error) {
    console.error('Error updating file content:', error);
    throw error;
  }
}

export async function clearFileContent(authClient: OAuth2Client, fileId: string){
  console.log('clearFileContent')
  const drive = google.drive({ version: 'v3', auth: authClient });

  try {
    // Retrieve the existing content of the file
    const fileResponse = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    

    // Append the new content to the existing content
    const newContent = " ";

    // Update the file with the new content
    const media = {
      mimeType: 'text/plain',
      body: newContent,
    };

    const updateResponse = await drive.files.update({
      fileId: fileId,
      media: media,
    });

    console.log('File content updatffed successfully', updateResponse.status);
  } catch (error) {
    console.error('Error updating file content:', error);
    throw error;
  }
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



