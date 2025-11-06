// – GLOBAL VARIABLES – Reused and only defined once for runtime optimization 

const REF = {
  // regex
  findDate: /(?:\b(?<monthn>\d{1,2})\/(?<dayn>\d{1,2})\/(?<yearn>\d{2,4}))|(?:(?<month>\b[a-zA-Z]{3,9})\s(?<day>\d\d?)(?:[a-zA-Z]{2,3})?(?:,\s(?<year>\d{2,4}))?)/ ,
  invoiceRegex: /invoice/i, 
  statementRegex: /statement/i,
  invoiceExcludeRegex: /personal|earn/i,
  apptReminderRegex: /appointment/i, 
  pastTenseRegex: /was/i, 


  // Months Array (zero indexed)
  months: ["january", "february", 
                "march", "april", "may", "june", 
                "july", "august", "september", 
                "october", "november", "december"], 
  
  // Get months length once and save as a const rather than referencing every loop 
  monthsLen: 12,

  // Today's Date
  today: new Date(Date.now()), 
  
};


function labels(n) {

  // Get Labels
  // Nested Invoice Labels 
  const parentInvoiceL = GmailApp.getUserLabelByName("Invoices"); 
  //    Sub-Labels 
  const invoiceL = GmailApp.getUserLabelByName("Invoices/Invoices"); 
  const statementL = GmailApp.getUserLabelByName("Invoices/Statements"); 
  const apptReminderL = GmailApp.getUserLabelByName("Appointment Reminders"); 

  // Subject line temp variable 
  let temp_subject = undefined;
  
  // Get Inbox Threads 
  const inboxThreads = GmailApp.getInboxThreads(0, 100);
  // FOR each message in inbox 
  for (let i = 0; i < inboxThreads.length; i++) {
    // Subject line 
    temp_subject = inboxThreads[i].getFirstMessageSubject(); 
    Logger.log(temp_subject); 
    // INVOICES
    // Add "Invoices" label 
    if (REF.invoiceRegex.test(temp_subject) && !REF.invoiceExcludeRegex.test(temp_subject)){
      Logger.log("Invoice"); 
      // inboxThreads[i].addLabel(invoiceL); 
      // inboxThreads[i].addLabel(parentInvoiceL);
    }
    // Add "Statements" label
    if (REF.statementRegex.test(temp_subject) && !REF.invoiceExcludeRegex.test(temp_subject)){
      Logger.log("Statement"); 
      // inboxThreads[i].addLabel(statementL);
      // inboxThreads[i].addLabel(parentInvoiceL);
    }

    // APPOINTMENT
    // If "Appointment" in subject (and no past tense references, i.e. exclude "How was your appointment?")
    if(REF.apptReminderRegex.test(temp_subject) && !REF.pastTenseRegex.test(temp_subject)) {

      // Print if Appointment 
      Logger.log("Is Appointment");

      // Get message recieved date 
      const sentDate = inboxThreads[i].getLastMessageDate(); 

      // ADD APPT LABEL
      // inboxThreads[i].addLabel(apptReminderL); 

      // Check for appointment date in subject  
      let tempDate = temp_subject.match(REF.findDate); 
      // Logger.log("parsed month day year: " + tempDate.groups.month + ", "+ tempDate.groups.day + ", " + tempDate.groups.year); 
      Logger.log("found month of "+ temp_subject + " " + tempDate);
      let parseMonth = tempDate.groups.month ? tempDate.groups.month : tempDate.groups.monthn; 
      let parseDay = tempDate.groups.day ? tempDate.groups.day : tempDate.groups.dayn; 
      let parseYear = tempDate.groups.year ? tempDate.groups.year : tempDate.groups.yearn; 


      const parseDateResults = parseDate(parseMonth, parseDay, parseYear, sentDate); 
      // Logger.log(i + " " + parseDateResults[1]);
      const apptDate = new Date(parseDateResults[0]); 
        

      Logger.log("MESSAGE " + i); 
      // if (!dayFound) {Logger.log("No appointment date found, used sent date + 7 days")}
      Logger.log(parseDateResults[1]); 
      Logger.log("Appointment Time: "+ tempDate[0]);
      Logger.log("Appointment Date Parsed: " + apptDate.toDateString()); 
      Logger.log("Full Subject Message: " + temp_subject)
      let timeElapsed1 = (REF.today.getTime() - apptDate.getTime()); 
      let timeElapsed = timeElapsed1/(24 * 60 * 60 * 1000); 


      Logger.log("Time Elapsed: " + timeElapsed); 
      if (REF.today.getTime() - apptDate.getTime() > (7 * 24 * 60 * 60 * 1000)){ // If appointment is more than 7 days past 
        Logger.log("Archive - more than 7 days past appointment."); 
      } else {
        Logger.log("Keep in inbox - not more than 7 days past appointment.");
      }
    }

    // Check applied labels - TESTING 
    let labelnamesstring = ""; 
    let labelnames = inboxThreads[i].getLabels();
    for (let j = 0; j < labelnames.length; j++) {
      labelnamesstring += labelnames[j].getName() + " ";
    }
    //Logger.log(temp_subject + "\t" + labelnamesstring);
  }
}; 
