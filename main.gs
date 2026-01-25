function main(n) {

  /* -Labels- 
  Financial 
    - Invoices  *
    - Banking
    - Insurance 
  Appointment Reminders *
  Verification Codes *

  Note: All labels should be checked first before moving (ie, business and shopping )

  // Future: use Google Properties manager for storing key and pairs 

  To-Do: 
  Implement Receipts sorting 
  Start "promotional" or by company (idk best name) - Newsletters
    - LinkedIn
    - Etsy 
  Shipping/ Shopping 


  */

  // Get Labels
  const apptReminderL = GmailApp.getUserLabelByName("Appointment Reminders");
  const verifcodeL = GmailApp.getUserLabelByName("Verification Codes"); 
  const parentFinancialL = GmailApp.getUserLabelByName("Financial"); 
  //    Sub-Labels 
  const invoiceL = GmailApp.getUserLabelByName("Financial/Invoices"); 
  // const statementL = GmailApp.getUserLabelByName("Financial/Statements"); 
  const bankingL = GmailApp.getUserLabelByName("Financial/Banking"); 
  

  // Subject line temp variable 
  let temp_subject = undefined;
  
  // Get Inbox Threads 
  const inboxThreads = GmailApp.getInboxThreads(0, 50);
  // FOR each message in inbox 
  for (let i = 0; i < inboxThreads.length; i++) {
    // SUBJECT line 
    temp_subject = inboxThreads[i].getFirstMessageSubject(); 
    Logger.log(temp_subject); 

    // For getting message body. All tested messages don't use schema, so ineffective for sorting 
    // const msg = Gmail.Users.Messages.get(
    //   'me',
    //   inboxThreads[i].getMessages()[0].getId(),  // Use message ID, not thread ID
    //   { format: 'raw' }  // 'raw' contains formatting info with schema info 
    // );

    
    
    // const rawContent = Utilities.newBlob(msg.raw).getDataAsString();

    // Logger.log("message content: " + rawContent);

    // // Check for different schema formats
    // const hasJSONLD = rawContent.includes('<script type="application/ld+json">');
    // const hasMicrodata = rawContent.includes('itemscope') && rawContent.includes('itemtype');
    // const hasRDFa = rawContent.includes('vocab="http://schema.org/');
    
    // Logger.log('JSON-LD: ' + hasJSONLD);
    // Logger.log('Microdata: ' + hasMicrodata);
    // Logger.log('RDFa: ' + hasRDFa);

    // const msg = Gmail.Users.Messages.get(
    //   'me',
    //   inboxThreads[i].getId(),
    //   { format: 'metadata', metadataHeaders: [
    //       'From',
    //       'Reply-To',
    //       'Precedence',
    //       'Auto-Submitted'
    //   ]}
    // );

    // FINANCIAL
    // Add "Financial" label 
    if (REF.invoiceRegex.test(temp_subject) && !REF.invoiceExcludeRegex.test(temp_subject)){
      Logger.log("Invoice"); 
      // inboxThreads[i].addLabel(invoiceL); 
      // inboxThreads[i].addLabel(parentFinancialL);
    }

    // APPOINTMENT
    // "Appointment" in subject (and no past tense references, i.e. exclude "How was your appointment?")
    if(!REF.pastTenseRegex.test(temp_subject) && REF.apptReminderRegex.test(temp_subject)) {
      
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
        Logger.log(apptDate[1]); 
      }
      
      // Debug // 
      // Logger.log("MESSAGE " + i); 
      // Logger.log("Appointment Time: "+ tempDate[0]);
      // Logger.log("Appointment Date Parsed: " + apptDate.toDateString()); 
      // Logger.log("Full Subject Message: " + temp_subject)
      // let timeElapsed1 = (REF.today.getTime() - apptDate.getTime()); 
      // let timeElapsed = timeElapsed1/(24 * 60 * 60 * 1000); 

      if (olderThan(apptDate, 4)){ // If appointment is more than 7 days past 
        Logger.log("Archive - more than 7 days past appointment."); 
      } else {
        Logger.log("Keep in inbox - not more than 7 days past appointment.");
      }

    }

    const sender = inboxThreads[i].getMessages()[0].getFrom(); 
    const senderEmail = sender ? (sender.match(/<(.+?)>/i)) : null;
    let email = null; 
    if (senderEmail) {
      email = senderEmail[1]; 
      Logger.log("sender email: " + senderEmail[1]); 
    }

    // BANKING
    // If sent from known address and contains bank keywords (and address exists)
    if(email && REF.bankingAddresses.test(email) && REF.bankingRegex.test(temp_subject)){
      Logger.log("first loop");
      // Check if a newsletter 
      const msg = inboxThreads[i].getMessages()[0].getBody();  //getBody is more efficient than getPlainBody
      if(!REF.bankingExcludeRegex.test(msg)){  //If body doesn't contain keywords 
        Logger.log("Bank Info"); 
      }
    }
    // Insurance
    else if (email && REF.insuranceAddresses.test(email)) {
      Logger.log("Insurance"); 
    }
    else if (email && REF.deliveryAddresses.test(email) && REF.deliveryRegex.test(temp_subject)){
      Logger.log("Delivery"); 
    }


    //   const headers = msg.payload.headers.reduce((acc, h) => {
    //   acc[h.name] = h.value;
    //   return acc;
    // }, {});

    // Logger.log(
    //   'Message ID: %s\nThread ID: %s\nSize: %s bytes\nFrom: %s\nReply-To: %s\nPrecedence: %s\nAuto-Submitted: %s',
    //   msg.id,
    //   msg.threadId,
    //   msg.sizeEstimate,
    //   headers['From'] || '(none)',
    //   headers['Reply-To'] || '(none)',
    //   headers['Precedence'] || '(none)',
    //   headers['Auto-Submitted'] || '(none)'
    // );


    

    // OTC or SSO 
    if (REF.verifCodeRegex.test(temp_subject)){
      // LABEL 
      Logger.log("Verification Code"); 
      //inboxThreads[i].addLabel(verifcodeL); 

      // AGE CHECK / ARCHIVE
      // Email received date 
      const sentDate = inboxThreads[i].getLastMessageDate(); 

      

      if (olderThan(sentDate, 2)){ // If received more than one day ago  
        Logger.log("Archive - verification more than 2 days old."); 
      } else {
        Logger.log("Keep in inbox - code not more than 2 days old.");
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
