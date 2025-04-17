import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Decode the Base64 encoded Google service account credentials
      const credentialsBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

      if (!credentialsBase64) {
        return res.status(500).json({ error: 'Service account credentials are missing' });
      }

      const credentialsJSON = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf-8'));

      // Authenticate using the service account credentials
      const auth = new google.auth.GoogleAuth({
        credentials: credentialsJSON,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // The rest of your logic for adding an appointment goes here

      // Example: Write the data to Google Sheets
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: 'your-spreadsheet-id',  // Replace with your spreadsheet ID
        range: 'Sheet1!A1',  // Adjust range as necessary
        valueInputOption: 'RAW',
        resource: {
          values: [
            ['Some value', 'More values'],
            // More rows of data as needed
          ],
        },
      });

      res.status(200).json({ status: 'success', data: response.data });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ status: 'error', message: 'Failed to add appointment', error: error.message });
    }
  } else {
    // Handle non-POST methods
    res.status(405).json({ error: 'Method not allowed' });
  }
}
