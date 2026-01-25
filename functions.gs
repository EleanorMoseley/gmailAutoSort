// Input: (string: email subject, string: date email was recieved) 
//    Date is parsed from subject string, if possible 
//    If not, the sent date +7 days is the assumed appointment date 
// Returns: [Date(), string for console log testing]

function parseDate (temp_subject, sentDate) {
    const apptDate = new Date (null); 
    let monthFound = false; 
    let dayFound = false; 
    let yearFound = false; 

    // Check for appointment date in subject  
    const tempDate = temp_subject.match(REF.findDate); 
    if (!tempDate) {
      // No date found in subject, use sent date + 7 days
      apptDate.setTime(sentDate.getTime()); 
      apptDate.setDate(apptDate.getDate() + 7);
      return [apptDate, `Month Found: ${monthFound}, Day Found: ${dayFound}, Year Found: ${yearFound}, Used Modified Recieved Date: true`];
    }
    let month = tempDate.groups.month ? tempDate.groups.month : tempDate.groups.monthn; 
    let day = tempDate.groups.day ? tempDate.groups.day : tempDate.groups.dayn; 
    let year = tempDate.groups.year ? tempDate.groups.year : tempDate.groups.yearn; 
    Logger.log("found month of "+ temp_subject + " " + tempDate);

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

// Input: (Date: appointment date, int: days to compare to) 
// Returns: bool: true if appointment has passed daysCompare, otherwise false 
function olderThan(apptDate, daysCompare){
  const timeElapsedMils = (REF.today.getTime() - apptDate.getTime()); 
  return (timeElapsedMils > (daysCompare*REF.millsPerDay)); 
}





