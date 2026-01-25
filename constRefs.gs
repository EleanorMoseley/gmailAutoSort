// – GLOBAL VARIABLES – Reused and only defined once for runtime optimization 
const REF = {
  // regex
  findDate: /(?:\b(?<monthn>\d{1,2})\/(?<dayn>\d{1,2})\/(?<yearn>\d{2,4}))|(?:(?<month>\b[a-z]{3,9})\s(?<day>\d\d?)(?:[a-z]{2,3})?(?:,\s(?<year>\d{2,4}))?)/i,
  invoiceRegex: /invoice|statement/i, 
  invoiceExcludeRegex: /personal|earn/i,
  apptReminderRegex: /appointment/i, 
  pastTenseRegex: /was/i, 
  // verifCodeRegex: /verification\scode|passcode|verify.*?code|code.*?verify/i, 
  verifCodeRegex: /verification\scode|passcode|verify|verify.*?code|code.*?verify|sign\Win/i,
  // receiptRegex: /receipt|receipt/is, 
  bankingRegex: /statement|payment|deposit/i, 
  bankingExcludeRegex: /newsletter/i,
  deliveryRegex: /deliver/i,
  todayRegex: /today/is,
  codeRegex: /\b\d{4,8}\b|\b(?=[A-Z0-9]{6,8}\b)(?=.*[A-Z])(?=.*\d)[A-Z0-9]+\b/m,


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
  millsPerDay: (24 * 60 * 60 * 1000),
  
  deliveryAddresses: /^system@entrata.com$/i,
  bankingAddresses: /^usbank@notifications.usbank.com$|^hello@email.rocketmoney.com$/i,
  insuranceAddresses: /^geico@et.geico.com$|^rentersmail@assurant.com$/i,
};