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

// // Regex Expressions
// const findDate = /(?:\b(?<monthn>\d{1,2})\/(?<dayn>\d{1,2})\/(?<yearn>\d{2,4}))|(?:(?<month>\b[a-zA-Z]{3,9})\s(?<day>\d\d?)(?:[a-zA-Z]{2,3})?(?:,\s(?<year>\d{2,4}))?)/;
// const invoiceRegex = /invoice/i; 
// const apptReminderRegex = /appointment/i;

// // Month Array (Zero indexed for text matching to int value for Date object)
// const months = ["january", "february", 
//                 "march", "april", "may", "june", 
//                 "july", "august", "september", 
//                 "october", "november", "december"];

// // Today's Date 
// const today = new Date(Date.now());

function parseDate (monthArg, dayArg, yearArg, sentDateArg) {
    const apptDate = new Date (null); 
    let monthFound = false; 
    let dayFound = false; 
    let yearFound = false; 
    let month = monthArg; 
    let day = dayArg; 
    let year = yearArg
    const sentDate = sentDateArg; 

    if (month && day){
      // Day – convert to int, verify, and set 
      day = parseInt(day);  
      if (day >= 1 && day <= 31) {  // set if valid day 
        apptDate.setDate(day); 
        dayFound = true; 
      }
      // Month - if day was already found found, continue 
      if (dayFound) { 
        month = month.toLowerCase(); // make lowercase (only works for string, so verify for !null)
        // Check for spelled month 
        for (let j = 0; j < REF.monthsLen; j++){ 
          if (REF.months[j].startsWith(month)){
            apptDate.setMonth(j); 
            monthFound = true; 
            break; 
          }
        }
        // Check for numerical month if spelled not found 
        if (!monthFound){
          month = parseInt(month); // convert string to int 
          if (month >= 1 && month <= 12){
            apptDate.setMonth(month); 
            monthFound = true; 
          }
        }
      }
      // YEAR 
      if (monthFound && dayFound && year){  // if year found, and month and day were successful 
        year = parseInt(year); // Must coerce after bool check 
        if (year >= 0 && year <= 99) {  // format 2-digit to 4-digit 
          year += 2000; 
        }
        if (year >= 2000 && year <= 2100){  // if valid year, set to apptDate 
          apptDate.setFullYear(year); 
          yearFound = true; 
        }
      } else if (monthFound && dayFound){   // if day and month found, no year 
          // if appt month is before when sent, assume it is for the next year and set 
          if (apptDate.getMonth() < sentDate.getMonth()) {
            apptDate.setFullYear(sentDate.getFullYear()+1); 
          } else {  // otherwise set appt year to sent year 
            apptDate.setFullYear(sentDate.getFullYear()); 
          }
      }
    }
    // if no valid appointment date found, set all found bools to false and use sent message date + 7 days 
    if (!dayFound || !monthFound) {
      // yearFound, dayFound, monthFound = false; 
      apptDate.setTime(sentDate.getTime()); 
      apptDate.setDate(apptDate.getDate() + 7); 
    }
    
    return [apptDate, `Month Found: ${monthFound}, Day Found: ${dayFound}, Year Found: ${yearFound}, Used Modified Recieved Date: ${!dayFound || !monthFound}`]; 
}


function labels(n) {


  // Get Labels
  const parentInvoiceL = GmailApp.getUserLabelByName("Invoices"); 
  const invoiceL = GmailApp.getUserLabelByName("Invoices/Invoices"); 
  const statementL = GmailApp.getUserLabelByName("Invoices/Statements"); 
  const apptReminderL = GmailApp.getUserLabelByName("Appointment Reminders"); 

  // Subject line temp variable 
  let temp_subject = undefined;
  
  // Get Inbox Threads 
  const inboxThreads = GmailApp.getInboxThreads(0, 100);
  // FOR LOOP - For each message in inbox 
  for (let i = 0; i < inboxThreads.length; i++) {
    // Subject line 
    temp_subject = inboxThreads[i].getFirstMessageSubject(); 

    // INVOICES
    // Add "Invoices" label 
    if (REF.invoiceRegex.test(temp_subject) && !REF.invoiceExcludeRegex.test(temp_subject)){
      inboxThreads[i].addLabel(invoiceL); 
      inboxThreads[i].addLabel(parentInvoiceL);}
    // Add "Statements" label
    if (REF.statementRegex.test(temp_subject && !REF.invoiceExcludeRegex.test(temp_subject))){
      inboxThreads[i].addLabel(statementL);
      inboxThreads[i].addLabel(parentInvoiceL);
    }
    // APPOINTMENT
    // If "Appointment" in subject (and no past tense references, i.e. exclude "How was your appointment?")
    if(REF.apptReminderRegex.test(temp_subject) && !REF.pastTenseRegex.test(temp_subject)) {

      
      // Get message recieved date 
      const sentDate = inboxThreads[i].getLastMessageDate(); 

      // ADD APPT LABEL
      inboxThreads[i].addLabel(apptReminderL); 

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
      

      // // Month and Day parse exist 
      // if (parseMonth && parseDay){
      //   // Day – convert to int, verify, and set 
      //   parseDay = parseInt(parseDay);  
      //   if (parseDay >= 1 && parseDay <= 31) {  // set if valid day 
      //     apptDate.setDate(parseDay); 
      //     dayFound = true; 
      //   }
      //   // Month - if day was already found found, continue 
      //   if (dayFound) { 
      //     parseMonth = parseMonth.toLowerCase(); // make lowercase (only works for string, so verify for !null)
      //     // Check for spelled month 
      //     for (let j = 0; j < REF.monthsLen; j++){ 
      //       if (months[j].startsWith(parseMonth)){
      //         apptDate.setMonth(j); 
      //         monthFound = true; 
      //         break; 
      //       }
      //     }
      //     // Check for numerical month if spelled not found 
      //     if (!monthFound){
      //       parseMonth = parseInt(parseMonth); // convert string to int 
      //       if (parseMonth >= 1 && parseMonth <= 12){
      //         apptDate.setMonth(parseMonth); 
      //         monthFound = true; 
      //       }
      //     }
      //   }
      //   // YEAR 
      //   let year = tempDate.groups.year ? tempDate.groups.year : tempDate.groups.yearn; 
      //   if (monthFound && dayFound && year){  // if year found, and month and day were successful 
      //     year = parseInt(year); // Must coerce after bool check 
      //     if (year >= 0 && year <= 99) {  // format 2-digit to 4-digit 
      //       year += 2000; 
      //     }
      //     if (year >= 2000 && year <= 2100){  // if valid year, set to apptDate 
      //       apptDate.setFullYear(year); 
      //       yearFound = true; 
      //     }
      //   } else if (monthFound && dayFound){   // if day and month found, no year 
      //       // if appt month is before when sent, assume it is for the next year and set 
      //       if (apptDate.getMonth() < sentDate.getMonth()) {
      //         apptDate.setFullYear(sentDate.getFullYear()+1); 
      //       } else {  // otherwise set appt year to sent year 
      //         apptDate.setFullYear(sentDate.getFullYear()); 
      //       }
      //       yearFound = true; 
      //   }
      // }
      // // if no valid appointment date found, set all found bools to false and use sent message date + 7 days 
      // if (!dayFound || !monthFound) {
      //   yearFound, dayFound, monthFound = false; 
      //   apptDate.setTime(sentDate.getTime()); 
      //   apptDate.setDate(apptDate.getDate() + 7); 
      // }

      

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
