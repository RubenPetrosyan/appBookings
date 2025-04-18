import { google } from 'googleapis';

// Handler for the /api/appointments endpoint
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, appointmentDate, timeSlot } = req.body;

    console.log('Received appointment data:', { name, email, appointmentDate, timeSlot });

    try {
      console.log('Initializing Google Auth...');
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      console.log('GoogleAuth initialized successfully.');

      const sheets = google.sheets({ version: 'v4', auth });

      const spreadsheetId = '1OOIUl8B8LYO0V8SxMjAyztiTbtxirIhS5ImwsAf_6Nc'; // Correct spreadsheet ID
      const range = 'Appointments!A2:D'; // Ensure this is the correct range

      console.log(`Appending data to spreadsheet with ID: ${spreadsheetId}, range: ${range}`);
      
      const resource = {
        values: [
          [name, email, appointmentDate, timeSlot],
        ],
      };

      console.log('Sending request to Google Sheets API...');
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource,
      });

      console.log('Appointment added successfully:', response);
      
      res.status(200).json({ status: 'success', message: 'Appointment added successfully!' });
    } catch (error) {
      console.error('Error while adding appointment:', error);
      
      if (error.response) {
        console.error('Google API Response:', error.response.data);
      }

      res.status(500).json({ status: 'error', message: 'Failed to add appointment', error: error.message });
    }
  } else {
    console.log(`Method ${req.method} not allowed for this endpoint`);
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
