"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  generateTokens,
} = require("./_testCommon");

let u1Token, u2Token, adminToken;
(async function () {
  ({ u1Token, u2Token, adminToken } = await generateTokens())
})();

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */


describe("POST /favorites/:username", function () {
  // const newCompany = {
  //   handle: "new",
  //   name: "New",
  //   logoUrl: "http://new.img",
  //   description: "DescNew",
  //   numEmployees: 10,
  // };

  // console.log("adminToken in favorites.test.js");
  // console.log(adminToken);

  test("ok for league for admin", async function () {

    // console.log("adminToken in 1st test of favorites.test.js");
    // console.log(!!adminToken);
    const resp = await request(app)
        .post("/favorites/u1")
        .send({ type: "league", favorite_id: 203 })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ 
      favorite: { username: "u1", leagueId: 203 }
    });
  });

  test("ok for league for correct user", async function () {
    const resp = await request(app)
        .post("/favorites/u1")
        .send({ type: "league", favorite_id: 203 })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ 
      favorite: { username: "u1", leagueId: 203 }
    });
  });

  test("ok for cup for correct user", async function () {
    const resp = await request(app)
        .post("/favorites/u1")
        .send({ type: "cup", favorite_id: 206 })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ 
      favorite: { username: "u1", cupId: 206 }
    });
  });

  test("ok for team for correct user", async function () {
    const resp = await request(app)
        .post("/favorites/u1")
        .send({ type: "team", favorite_id: 549 })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ 
      favorite: { username: "u1", teamId: 549 }
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/favorites/u1")
        .send({ type: "league" })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/favorites/u1")
        .send({ type: "sokko", favorite_id: 203 })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

// /************************************** GET /companies */

// describe("GET /companies", function () {
//   test("ok for anon", async function () {
//     const resp = await request(app).get("/companies");
//     expect(resp.body).toEqual({
//       companies:
//           [
//             {
//               handle: "c1",
//               name: "C1",
//               description: "Desc1",
//               numEmployees: 1,
//               logoUrl: "http://c1.img",
//             },
//             {
//               handle: "c2",
//               name: "C2",
//               description: "Desc2",
//               numEmployees: 2,
//               logoUrl: "http://c2.img",
//             },
//             {
//               handle: "c3",
//               name: "C3",
//               description: "Desc3",
//               numEmployees: 3,
//               logoUrl: "http://c3.img",
//             },
//           ],
//     });
//   });

//   test("works: filtering", async function () {
//     const resp = await request(app)
//         .get("/companies")
//         .query({ minEmployees: 3 });
//     expect(resp.body).toEqual({
//       companies: [
//         {
//           handle: "c3",
//           name: "C3",
//           description: "Desc3",
//           numEmployees: 3,
//           logoUrl: "http://c3.img",
//         },
//       ],
//     });
//   });

//   test("works: filtering on all filters", async function () {
//     const resp = await request(app)
//         .get("/companies")
//         .query({ minEmployees: 2, maxEmployees: 3, name: "3" });
//     expect(resp.body).toEqual({
//       companies: [
//         {
//           handle: "c3",
//           name: "C3",
//           description: "Desc3",
//           numEmployees: 3,
//           logoUrl: "http://c3.img",
//         },
//       ],
//     });
//   });

//   test("bad request if invalid filter key", async function () {
//     const resp = await request(app)
//         .get("/companies")
//         .query({ minEmployees: 2, nope: "nope" });
//     expect(resp.statusCode).toEqual(400);
//   });
// });

// /************************************** GET /companies/:handle */

// describe("GET /companies/:handle", function () {
//   test("works for anon", async function () {
//     const resp = await request(app).get(`/companies/c1`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c1",
//         name: "C1",
//         description: "Desc1",
//         numEmployees: 1,
//         logoUrl: "http://c1.img",
//         jobs: [
//           { id: testJobIds[0], title: "J1", equity: "0.1", salary: 1 },
//           { id: testJobIds[1], title: "J2", equity: "0.2", salary: 2 },
//           { id: testJobIds[2], title: "J3", equity: null, salary: 3 },
//         ],
//       },
//     });
//   });

//   test("works for anon: company w/o jobs", async function () {
//     const resp = await request(app).get(`/companies/c2`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c2",
//         name: "C2",
//         description: "Desc2",
//         numEmployees: 2,
//         logoUrl: "http://c2.img",
//         jobs: [],
//       },
//     });
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app).get(`/companies/nope`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** PATCH /companies/:handle */

// describe("PATCH /companies/:handle", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c1",
//         name: "C1-new",
//         description: "Desc1",
//         numEmployees: 1,
//         logoUrl: "http://c1.img",
//       },
//     });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found on no such company", async function () {
//     const resp = await request(app)
//         .patch(`/companies/nope`)
//         .send({
//           name: "new nope",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request on handle change attempt", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           handle: "c1-new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request on invalid data", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           logoUrl: "not-a-url",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

// /************************************** DELETE /companies/:handle */

// describe("DELETE /companies/:handle", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ deleted: "c1" });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app)
//         .delete(`/companies/nope`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
