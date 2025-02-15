"use strict";

describe("config can come from env", function () {
  test("works", function () {
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "other";
    process.env.NODE_ENV = "other";

    const config = require("./config");

    // Check environment variables
    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("other");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

    // Remove DATABASE_URL and test default development URI
    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    // Default to "development" database URI
    expect(config.getDatabaseUri()).toEqual("postgresql:///jobly");

    // Test "test" environment URI
    process.env.NODE_ENV = "test";
    expect(config.getDatabaseUri()).toEqual("postgresql:///jobly_test");
  });
});
