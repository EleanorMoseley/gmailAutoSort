# Gmail Auto Sort
An Apps Script program to run advanced custom Gmail sorting procedures for a clean inbox. 

Developed in the Google Developer's [Apps Script](https://developers.google.com/apps-script) environment. Developed in JavaScript with [Gmail Service](https://developers.google.com/apps-script/reference/gmail) for real time Gmail integration.  
Requires "Third-Party Apps and Services" authorization in Google Account. 

## Current Features: 
- Check for and Sort by Labels:
  - Appointment Reminders
    - Checks for and parses appointment date in subject
    - If a set number of days have passed since appointment date, remove from inbox
  - Financial 
    - Statements/Invoices/Bills
    - Receipts
  - Handles Labels and Sublabels 

## Features in Progress: 
- Identify one-time verification codes and remove from inbox after one day
- Catagorize promotion/newsletter items in a seperate folder out of inbox while maintaining their original read/unread status
- Shipping/delivery notifications
- Banking catagorization
  - Sender email identification to prevent fraud/phishing



### Development 
Created as a personal project by Eleanor Moseley.  
[Google Apps Script GitHub Assistant](https://chromewebstore.google.com/detail/lfjcgcmkmjjlieihflfhjopckgpelofo?utm_source=item-share-cb) Chrome Extension used to connect to repository. 
