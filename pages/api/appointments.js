import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  // Parse request body
  const { name, email, appointment_date, time_slot } = req.body;
  if (!name || !email || !appointment_date || !time_slot) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  // Load credentials from environment
  let credentials;
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Invalid credentials format' });
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  try {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    const spreadsheetId = '1OOIUl8LYO0V8SxMjAyztiTbtxirIhS5ImwsAf_6Nc'; // your real sheet ID
    const sheetName = 'Sheet1';

    // Generate appointment ID and timestamp
    const appointmentId = `APPT-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const row = [
      appointmentId,
      name,
      email,
      appointment_date,
      time_slot,
      'Pending',
      timestamp,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:G`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return res.status(200).json({ status: 'success', appointmentId });
  } catch (error) {
    console.error('Google Sheets Error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
