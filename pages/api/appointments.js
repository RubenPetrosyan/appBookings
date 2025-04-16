import { GoogleSpreadsheet } from 'google-spreadsheet';

const SERVICE_ACCOUNT_CREDS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
const SPREADSHEET_ID = '1OOIUl8LYO0V8SxMjAyztiTbtxirIhS5ImwsAf_6Nc';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { name, email, appointment_date, time_slot } = req.body;

  if (!name || !email || !appointment_date || !time_slot) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  try {
    console.log('Connecting to Google Sheet...');
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    console.log('Authenticating...');
    await doc.useServiceAccountAuth({
      client_email: SERVICE_ACCOUNT_CREDS.client_email,
      private_key: SERVICE_ACCOUNT_CREDS.private_key.replace(/\\n/g, '\n'),
    });

    console.log('Loading document info...');
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Sheet1'];
    if (!sheet) {
      console.error('Sheet1 not found');
      return res.status(500).json({ status: 'error', message: 'Sheet1 not found' });
    }

    const appointmentId = `APPT-${Date.now()}`;
    const timestamp = new Date().toISOString();

    console.log('Adding row...');
    await sheet.addRow({
      'Appointment ID': appointmentId,
      'Name': name,
      'Email': email,
      'Appointment Date': appointment_date,
      'Time Slot': time_slot,
      'Status': 'Pending',
      'Timestamp': timestamp,
    });

    console.log('Appointment added:', appointmentId);
    return res.status(200).json({ status: 'success', appointmentId });
  } catch (error) {
    console.error('Google Sheets Error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
