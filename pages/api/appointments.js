import { google } from 'googleapis';

// API route to handle appointments
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 1. Parse the credentials from the environment variable
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

      // 2. Set up Google Sheets authentication
      const auth = new google.auth.GoogleAuth({
        credentials: credentials, // Use the credentials from the environment variable
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // 3. Define your spreadsheet ID and range
      const spreadsheetId = '1OOIUl8B8LYO0V8SxMjAyztiTbtxirIhS5ImwsAf_6Nc'; // Replace with your actual spreadsheet ID
      const range = 'Sheet1!A:F'; // Adjust the range as needed, for example 'Sheet1!A:F' for columns A-F

      // 4. Get data from the request body
      const { appointmentId, name, email, appointmentDate, timeSlot, status } = req.body;

      // 5. Write the new appointment data to the Google Sheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [[appointmentId, name, email, appointmentDate, timeSlot, status]],
        },
      });

      // 6. Return success response
      res.status(200).json({ status: 'success', message: 'Appointment added successfully', data: response.data });
    } catch (error) {
      // Handle errors and respond with an error message
      console.error('Error adding appointment:', error);
      res.status(500).json({ status: 'error', message: 'Failed to add appointment', error: error.message });
    }
  } else {
    // Return 405 if method is not POST
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }
}
