"use strict";

/** Shared config for application; can be required many places. */

const jose = require("jose");  // new

require("dotenv").config();
require("colors");

// console.log("THIS IS config.js !!");

const ALG_TYPE = 'HS256';

const secret = new TextEncoder().encode(
  "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
);

const SECRET_KEY = process.env.SECRET_KEY || secret;

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "footy_test"
      : process.env.DATABASE_URL || "footy";
}

// Speed up bcrypt during test, since the algorithm safety isn't being tested
// Evaluate later if this should be increased for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

if (process.env.NODE_ENV !== "test" &&
    process.env.NODE_ENV !== "other") {    // ??? 
  // console.log();
  console.log(getDatabaseUri());
  console.log(process.env.NODE_ENV);
  console.log("\n**********".blue);
  console.log("Footy Config".red);
  console.log("----------".blue);
  console.log("SECRET_KEY:".yellow, SECRET_KEY);
  console.log("PORT:".yellow, PORT.toString());
  console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR.toString());
  console.log("Database:".yellow, getDatabaseUri());
  console.log("**********\n".blue);
  // console.log();  
}

module.exports = {
  ALG_TYPE,
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
}