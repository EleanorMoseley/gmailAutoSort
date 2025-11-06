// – GLOBAL VARIABLES – Reused and only defined once for runtime optimization 
const REF = {
  // regex
  findDate: /(?:\b(?<monthn>\d{1,2})\/(?<dayn>\d{1,2})\/(?<yearn>\d{2,4}))|(?:(?<month>\b[a-z]{3,9})\s(?<day>\d\d?)(?:[a-z]{2,3})?(?:,\s(?<year>\d{2,4}))?)/i,
  invoiceRegex: /invoice|statement/i, 
  invoiceExcludeRegex: /personal|earn/i,
  apptReminderRegex: /appointment/i, 
  pastTenseRegex: /was/i, 
  verifCodeRegex: /verification\scode|verify.*?code|code.*?verify/i, 
  receiptRegex: /receipt|receipt/is, 
  todayRegex: /today/is,


  // Months Array (zero indexed)
  months: ["january", "february", 
                "march", "april", "may", "june", 
                "july", "august", "september", 
                "october", "november", "december"], 
  
  // Get months length once and save as a const rather than referencing every loop 
  monthsLen: 12,

  // Today's Date
  today: new Date(Date.now()), 

  // Mills Per Day 
  millsPerDay: (24 * 60 * 60 * 1000)
};