var SHEET_NAME = "Bookings";
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();
    sheet.appendRow([
      data.id || Date.now(),
      data.name,
      data.email,
      data.phone,
      data.service,
      data.date,
      data.time,
      data.createdAt || new Date().toISOString()
    ]);
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var rows = sheet.getDataRange().getValues();
    var headers = rows[0];
    var appointments = [];
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var app = {};
        for (var j = 0; j < headers.length; j++) {
            app[headers[j].toLowerCase()] = row[j];
        }
        appointments.push(app);
    }
    return ContentService.createTextOutput(JSON.stringify(appointments))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["ID", "Name", "Email", "Phone", "Service", "Date", "Time", "CreatedAt"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#276f7a").setFontColor("white");
  }
  return sheet;
}
function setup() {
  getOrCreateSheet();
  Logger.log("Sheet set up successfully!");
}