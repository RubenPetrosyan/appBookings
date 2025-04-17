import { google } from 'googleapis';

// Handler for the /api/appointments endpoint
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, appointmentDate, timeSlot } = req.body;

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      const spreadsheetId = 'your-spreadsheet-id'; // Replace with your actual spreadsheet ID
      const range = 'Sheet1!A2:D'; // Adjust based on your sheet's layout

      const resource = {
        values: [
          [name, email, appointmentDate, timeSlot],
        ],
      };

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource,
      });

      res.status(200).json({ status: 'success', message: 'Appointment added successfully!' });
    } catch (error) {
      console.error('Error while adding appointment:', error);
      res.status(500).json({ status: 'error', message: 'Failed to add appointment', error: error.message });
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
