"use strict";

/** Routes for favorites. */

const jsonschema = require("jsonschema");
const express = require("express");
const Local = require("../models/local");
const teamNewSchema = require("../schemas/teamNew.json");
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const router = new express.Router();


/** POST /team  { id, name, code, country, founded, national, logoUrl, venueId } 
 * 
 *           => { id, name, code, country, founded, national, logoUrl, venueId }
 * 
 * Authorization required: user
 */

router.post("/team", ensureLoggedIn, async function (req, res, next) {
  // console.log(`GET locals/team/:id`);
  try {
    const validator = jsonschema.validate(req.body, teamNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const team = await Local.addTeam(req.body);
    return res.status(201).json({ team });
  } catch (err) {
    return next(err);
  }
});


// TODO: return format change -> { team: { id, name } }
/** GET /team/[id]  => { id, name }
 * *
 * Authorization required: none
 */

router.get("/team/:id", async function (req, res, next) {
  console.log(`GET locals/team/:id`);
  try {
    const team = await Local.getTeam(req.params.id);
    return res.json(team);
  } catch (err) {
    return next(err);
  }
});


/** GET /timezones/[continent]  => { cities: [ { city }, ... ] }
 * *
 * Authorization required: none
 */

router.get("/timezones/:continent", async function (req, res, next) {
  console.log(`GET locals/timezones/:continent`);
  try {
    const cities = await Local.findCities(req.params.continent);
    return res.json({ cities });
  } catch (err) {
    return next(err);
  }
});


// TODO: return format change
/** GET /countries  => { countries: [ { country }, ... ] }
 * *
 * Authorization required: none
 */

router.get("/countries", async function (req, res, next) {
  console.log(`GET locals/countries`);
  try {
    const countries = await Local.getLeagueCountries();
    return res.json(countries);
  } catch (err) {
    return next(err);
  }
});


// TODO: logo_url -> logoUrl
//       return format change
/** GET /leagues/[country]  => { leagues: [ { id, name, logoUrl, type }, ... ] }
 * *
 * Authorization required: none
 */

router.get("/leagues/:country", async function (req, res, next) {
  console.log(`GET locals/leagues/:country`);
  try {
    const leagues = await Local.getCountrysLeagues(req.params.country);
    return res.json(leagues);
  } catch (err) {
    return next(err);
  }
});

 // TODO: logo_url -> logoUrl
/** GET /cups/[id]  => { name, logoUrl, country }
 * *
 * Authorization required: none
 */

router.get("/cups/:id", async function (req, res, next) {
  console.log(`GET locals/cups/:id`);
  try {
    const cup = await Local.getCupById(+req.params.id);
    return res.json(cup);
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
