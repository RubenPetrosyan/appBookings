// pages/api/appointments.js
import { GoogleSpreadsheet } from 'google-spreadsheet';

const SPREADSHEET_ID = '1OOIUl8LYO0V8SxMjAyztiTbtxirIhS5ImwsAf_6Nc';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    // STEP 1: Log raw environment variable
    console.log('🔍 Raw env:', process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    // STEP 2: Parse credentials
    const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    // STEP 3: Log key elements
    console.log('✅ client_email:', creds.client_email);
    console.log('✅ private_key preview:', creds.private_key?.slice(0, 30));

    // STEP 4: Connect to Google Spreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Sheet1'];

    if (!sheet) {
      console.error('❌ Sheet1 not found');
      return res.status(500).json({ status: 'error', message: 'Sheet1 not found' });
    }

    // STEP 5: Extract data
    const { name, email, appointment_date, time_slot } = req.body;

    if (!name || !email || !appointment_date || !time_slot) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    // STEP 6: Add row
    const appointmentId = `APPT-${Date.now()}`;
    const timestamp = new Date().toISOString();

    await sheet.addRow({
      'Appointment ID': appointmentId,
      'Name': name,
      'Email': email,
      'Appointment Date': appointment_date,
      'Time Slot': time_slot,
      'Status': 'Pending',
      'Timestamp': timestamp,
    });

    console.log('✅ Appointment added:', appointmentId);

    return res.status(200).json({ status: 'success', appointmentId });
  } catch (error) {
    console.error('🔥 ERROR:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
