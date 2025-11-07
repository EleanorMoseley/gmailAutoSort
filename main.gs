function main(n) {

  /* -Labels- 
  Financial 
    - Invoices  
    - Receipts 
  Appointment Reminders 
  Confirmation Codes 

  Note: All labels should be checked first before moving (ie, business and shopping )

  To-Do: 
  Change Invoices to Financial 
  Implement Receipts sorting 
  Passcodes 
  Start "promotional" or by company (idk best name) - Newsletters
    - LinkedIn
    - Etsy 
  Shipping/ Shopping 
  Banking!! 

  */

  // Get Labels
  const apptReminderL = GmailApp.getUserLabelByName("Appointment Reminders");
  const verifcodeL = GmailApp.getUserLabelByName("Verification Codes"); 
  const parentFinancialL = GmailApp.getUserLabelByName("Financial"); 
  //    Sub-Labels 
  const invoiceL = GmailApp.getUserLabelByName("Financial/Invoices"); 
  // const statementL = GmailApp.getUserLabelByName("Financial/Statements"); 
  const receiptsL = GmailApp.getUserLabelByName("Financial/Receipts"); 
  

  // Subject line temp variable 
  let temp_subject = undefined;
  
  // Get Inbox Threads 
  const inboxThreads = GmailApp.getInboxThreads(0, 100);
  // FOR each message in inbox 
  for (let i = 0; i < inboxThreads.length; i++) {
    // Subject line 
    temp_subject = inboxThreads[i].getFirstMessageSubject(); 
    Logger.log(temp_subject); 

    // FINANCIAL
    // Add "Financial" label 
    if (REF.invoiceRegex.test(temp_subject) && !REF.invoiceExcludeRegex.test(temp_subject)){
      Logger.log("Invoice"); 
      // inboxThreads[i].addLabel(invoiceL); 
      // inboxThreads[i].addLabel(parentFinancialL);
    }

    // APPOINTMENT
    // "Appointment" in subject (and no past tense references, i.e. exclude "How was your appointment?")
    if(REF.apptReminderRegex.test(temp_subject) && !REF.pastTenseRegex.test(temp_subject)) {
      
      // ADD APPT LABEL
      // inboxThreads[i].addLabel(apptReminderL);
      
      // Print if Appointment 
      Logger.log("Is Appointment");

      // Appointment Date 
      let apptDate = null;

      // Email recieved date 
      const sentDate = inboxThreads[i].getLastMessageDate(); 

      // GET APPOINTMENT DATE 
      if (temp_subject.match(REF.today) != null){ // If appointment says "today"
        apptDate = sentDate; 
      } else {
        apptDate = parseDate(temp_subject, sentDate)[0]; 
        Logger.log(parseDateResults[1]); 
      }
      
      // Debug // 
      // Logger.log("MESSAGE " + i); 
      // Logger.log("Appointment Time: "+ tempDate[0]);
      // Logger.log("Appointment Date Parsed: " + apptDate.toDateString()); 
      // Logger.log("Full Subject Message: " + temp_subject)
      // let timeElapsed1 = (REF.today.getTime() - apptDate.getTime()); 
      // let timeElapsed = timeElapsed1/(24 * 60 * 60 * 1000); 

      if (olderThan(apptDate, 4)){ // If appointment is more than 7 days past 
        Logger.log("Archive - more than 4 days past appointment."); 
      } else {
        Logger.log("Keep in inbox - not more than 4 days past appointment.");
      }

    }

    // Passcodes 
    if (REF.verifCodeRegex.test(temp_subject)){
      // LABEL 
      Logger.log("Verification Code"); 
      //inboxThreads[i].addLabel(verifcodeL); 

      // AGE CHECK / ARCHIVE
      // Email recieved date 
      const sentDate = inboxThreads[i].getLastMessageDate(); 

      if (olderThan(sentDate, 1)){ // If received more than one day ago  
        Logger.log("Archive - verification more than 1 day old."); 
      } else {
        Logger.log("Keep in inbox - code not more than 1 day old.");
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
