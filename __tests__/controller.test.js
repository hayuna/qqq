import supertest from "supertest";
import app from "../src/app";

describe("createSite", () => {
  describe("POST /createSite", () => {
    describe("when there is no parameters", () => {
      it("should fail with invalid values", async () => {
          await supertest(app)
            .post("/createSite")
            .expect((response) => {
              expect(response.status).toBe(400);
              expect(response.body).toMatchObject({
                invalidValues: [
                  "dataCenter is required",
                  "countryCode is required",
                  "language is required",
                  "system is required",
                  "userKey is required",
                  "secret is required",
                ],
              });
            });
      });
    });
    describe("when parameter is forbidden", () => {
      it("should fail with incorrect parameters", async () => {
          await supertest(app)
            .post("/createSite")
            .send({
              dataCenter: "US",
              language: "en",
              countryCode: "AU",
              system: "AEM",
              userKey: "testUserKey",
              secret: "test-secret",
              incorrect: true,
            })
            .expect((response) => {
              expect(response.status).toBe(400);
              expect(response.body).toMatchObject({
                incorrectParameters: ["incorrect"],
              });
            });
      });
    });
  });
});
