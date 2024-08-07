import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

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
    console.error('Error retrieving file content:', error);
    return {};
  }
}

export default getFileContent;
