const chai = require('chai');
const expect = chai.expect;
const test = require('supertest')
const fs = require("fs")
const server = require('../server')
var access_token = "";

function test1() {
    var data = fs.readFileSync('/home/admin1/Desktop/apollo graphql/test/data.JSON');
    var data1 = JSON.parse(data);
    return data1;
}

describe('Register and Login', () => {
    it("register", (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .send({ query: test1().register })

            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.signUp.success).to.be.true
                done();
                
            })

    })

    it('login', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .send({ query: test1().login })
            .expect(200)
            .end((err, res) => {

                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.login.success).to.be.true
                //console.log(JSON.parse(res.text).data.login.token)
                console.log(access_token);
                done();
            })
    });
})

describe('labels', () => {
    it('login', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .send({ query: test1().login })
            .expect(200)
            .end((err, res) => {

                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.login.success).to.be.true

                //console.log(JSON.parse(res.text).data.login.token)
                access_token =JSON.parse(res.text).data.login.token;
                console.log(access_token);
                
                done();
            })
    });
    it('createLabel', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .query({"token":access_token})
            .send({ query: test1().createLabel })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.createLabel.success).to.be.true
                done();
            })
    });
    it('updateLabel', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .query({"token":access_token})
            .send({ query: test1().updateLabel })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.updateLabel.success).to.be.true
                done();
            })
    });
    it('removeLabel', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .query({"token":access_token})
            .send({ query: test1().removeLabel })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.removeLabel.success).to.be.true
                done();
            })
    });
})

describe("notes",() => {2
    it("createNote", (done) => {
        test("http://localhost:4000")
        .post('/graphql')
        .query({"token":access_token})
        .send({ query : test1().createNote})
        .expect(200)
        .end((err,res) => {
            if(err) {
                return done(err);
            }
            expect(JSON.parse(res.text).data.createNote.success).to.be.true
            done();
        })
    })
})