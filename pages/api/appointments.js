// pages/api/appointments.js
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

  // Decode base64 credentials from env
  let credentials;
  try {
    const base64 = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    if (!base64) throw new Error('Missing base64 credentials');

    const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
    credentials = JSON.parse(jsonString);
  } catch (err) {
    console.error('Failed to decode credentials:', err.message);
    return res.status(500).json({ status: 'error', message: 'Invalid credentials format' });
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  try {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    const spreadsheetId = '1OOIUl8LYO0V8SxMjAyztiTbtxirIhS5ImwsAf_6Nc'; // your actual Sheet ID
    const sheetName = 'Sheet1';

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
