const expect = require("expect");
const request = require("supertest");

var server = require('../server')
var todo = require("../models/todo")


describe("POST /todos", () => {

  it("Should create a todo", (done) => {

    request(server)
      .post("/todos")
      .send( {
        text: "Test todo"
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe("Test todo")
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        todo.find().then( (todolist) => {
          expect(todolist.length).toBe(1)
          expect(todolist[0].text).toBe("Test todo")
          done();
        }).catch( (err) => {
          done(err)
        })

      })

  })


})
