var should = require("chai").should(),
  expect = require("chai").expect,
  supertest = require("supertest"),
  api = supertest("http://localhost:3000"),
  username = 'h4ck3r',
  first_name = 'Elliot',
  last_name = 'Alderson',
  password = 'fsociety';

// USERS
describe("GET /api/users", function() {
  it("should return a 200 response", function(done) {
    api.get("/api/users")
      .set("Accept", "application/json")
      .expect(200)
    done()
  });
});

describe("POST /authorization", (done) => {
  it("should create a user", (done) => {
    api.post("/api/authorization")
      .set("Accept", "application/json")
      .send({
        username,
        first_name,
        last_name,
        password
      })
      .end((err, res) => {
        userId = res.body.user,
        token = res.token;
        console.log('Token= ', res)
        expect(res.status).to.be.eql(404)
        done()
      })
  });
  it("should return an unauthrized status", (done) => {
    api.get("/api/users")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .expect(401, done)
  });
})

// MESSAGES
describe('GET /api/messages', (done) => {
  it('should return a 200 reponse', (done) => {
    api.get('/api/messages')
      .set('Accept', 'application/json')
      .expect(200)
    done()
  });
  it('should return an object with a field called content', ((done) => {
    api.get('/api/messages')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body[0]).to.have.property('content')
        done()
      })
  }))
});

//GROUPS
describe("GET /api/groups", function() {
  it("should return a 200 response", function(done) {
    api.get("/api/groups")
      .set("Accept", "application/json")
      .expect(200)
    done()
  });
});
