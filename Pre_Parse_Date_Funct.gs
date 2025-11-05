function parseDate0 () {

  
}


function labels0(n) {

  // NEXT ---> 
  // Seperate date detection into seperate function to be reused 

  // Month Keys 
  const months = ["january", "february", 
                  "march", "april", "may", "june", 
                  "july", "august", "september", 
                  "october", "november", "december"]; 

  // Get Invoice Label 
  const invoiceL = GmailApp.getUserLabelByName("Invoices"); 
  const apptReminderL = GmailApp.getUserLabelByName("Appointment Reminders"); 

  // Today's Date 
  const today = new Date(Date.now()); 

// Subject line temp variable 
  let temp_subject = undefined;
  
  // REGEX Experessions 
  const invoiceRegex = /invoice/i; 
  const apptReminderRegex = /appointment/i;
  const findDate = /(?:\b(?<monthn>\d{1,2})\/(?<dayn>\d{1,2})\/(?<yearn>\d{2,4}))|(?:(?<month>\b[a-zA-Z]{3,9})\s(?<day>\d\d?)(?:[a-zA-Z]{2,3})?(?:,\s(?<year>\d{2,4}))?)/;


  // Get Inbox Threads 
  const inboxThreads = GmailApp.getInboxThreads(0, 100);
  // FOR LOOP - For each message in inbox 
  for (let i = 0; i < inboxThreads.length; i++) {
    // VARIABLES
    // Subject line 
    temp_subject = inboxThreads[i].getFirstMessageSubject(); 

    // INVOICES
    // Add "Invoices" label 
    if (invoiceRegex.test(temp_subject)){
      (inboxThreads[i].addLabel(invoiceL)); }
    
    // APPOINTMENT
    // If "Appointment" in subject  
    if(apptReminderRegex.test(temp_subject)) {
      const apptDate = new Date (null); 
      let monthFound = false; 
      let dayFound = false; 
      let yearFound = false; 
      
      // Get message recieved date 
      const sentDate = inboxThreads[i].getLastMessageDate(); 

      // ADD APPT LABEL
      inboxThreads[i].addLabel(apptReminderL); 

      // Check for appointment date in subject  
      let tempDate = temp_subject.match(findDate); 
      let parseMonth = tempDate.groups.month ? tempDate.groups.month : tempDate.groups.monthn; 
      let parseDay = tempDate.groups.day ? tempDate.groups.day : tempDate.groups.dayn; 

      // Month and Day parse exist 
      if (parseMonth && parseDay){
        // Day – convert to int, verify, and set 
        parseDay = parseInt(parseDay);  
        if (parseDay >= 1 && parseDay <= 31) {  // set if valid day 
          apptDate.setDate(parseDay); 
          dayFound = true; 
        }
        // Month - if day was already found found, continue 
        if (dayFound) { 
          parseMonth = parseMonth.toLowerCase(); // make lowercase (only works for string, so verify for !null)
          // Check for spelled month 
          let m = null; 
          for (let j = 0; j < months.length; j++){
            m = months[j]; 
            if (months[j].startsWith(parseMonth)){
              apptDate.setMonth(j); 
              monthFound = true; 
              break; 
            }
          }
          // Check for numerical month if spelled not found 
          if (!monthFound){
            parseMonth = parseInt(parseMonth); // convert string to int 
            if (parseMonth >= 1 && parseMonth <= 12){
              apptDate.setMonth(parseMonth); 
              monthFound = true; 
            }
          }
        }
        // YEAR 
        let year = tempDate.groups.year ? tempDate.groups.year : tempDate.groups.yearn; 
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
            yearFound = true; 
        }
      }
      // if no valid appointment date found, set all found bools to false and use sent message date + 7 days 
      if (!dayFound || !monthFound) {
        yearFound, dayFound, monthFound = false; 
        apptDate.setTime(sentDate.getTime()); 
        apptDate.setDate(apptDate.getDate() + 7); 
      }

      

      Logger.log("MESSAGE " + i); 
      if (!dayFound) {Logger.log("No appointment date found, used sent date + 7 days")}
      Logger.log("Appointment Time: "+ tempDate[0]);
      Logger.log("Appointment Date Parsed: " + apptDate.toDateString()); 

      Logger.log("Time Elapsed: " + (today.getTime() - apptDate.getTime()));  

      if (today.getTime() - apptDate.getTime() > (7 * 24 * 60 * 60 * 1000)){ // If appointment is more than 7 days past 
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
