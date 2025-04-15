// Real Google Sheet ID from your URL
const SPREADSHEET_ID = '1OOIUl8B8LYO0V8SxMjAyztiTbtxirIhS5ImwsAf_6Nc';
const APPOINTMENTS_SHEET = 'Appointments';

/**
 * doPost: Receives POST requests, parses appointment data,
 * and appends it to the Google Sheet.
 * Expected JSON payload format:
 * {
 *   "name": "User Name",
 *   "email": "user@example.com",
 *   "appointment_date": "YYYY-MM-DD",
 *   "time_slot": "09:00"
 * }
 */
function doPost(e) {
  try {
    // Parse the JSON data from the POST request
    const data = JSON.parse(e.postData.contents);
    
    // Create the new row data.
    // Assumes the sheet has columns: Name, Email, Appointment Date, Time Slot, Timestamp.
    const appointmentData = [
      data.name,
      data.email,
      data.appointment_date,
      data.time_slot,
      new Date()  // Timestamp when the booking is made
    ];
    
    // Open the spreadsheet and get the Appointments sheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPOINTMENTS_SHEET);
    
    // Append the data as a new row at the bottom of the sheet
    sheet.appendRow(appointmentData);
    
    // Return a JSON success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // In case of an error, return a JSON error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet: Optional function to verify that the web app is up.
 */
function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running.");
}
