import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

async function getFileContent(authClient: OAuth2Client, fileId: string): Promise<void> {
  const drive = google.drive({ version: 'v3', auth: authClient });

  try {
    // Retrieve the file content as text
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media' // Use 'media' to get the file content
    }, { responseType: 'text' });

    // Print the file content
    console.log('File Content:\n', response.data);
  } catch (error) {
    console.error('Error retrieving file content:', error);
  }
}

export default getFileContent;
