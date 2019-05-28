const chai = require('chai');
const expect = chai.expect;
const test = require('supertest')
const fs = require("fs")
const server = require('../server')
var access_token = "";

function test1() {
    var data = fs.readFileSync('test/data.JSON');
    var data1 = JSON.parse(data);
    return data1;
}

describe('Register and Login', () => {
    it("register", (done) => {
        test(process.env.URL)
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
        test(process.env.URL)
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
        test(process.env.URL)
            .post('/graphql')
            .send({ query: test1().login })
            .expect(200)
            .end((err, res) => {

                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.login.success).to.be.true

                //console.log(JSON.parse(res.text).data.login.token)
                access_token = JSON.parse(res.text).data.login.token;
                console.log(access_token);

                done();
            })
    });
    it('createLabel', (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
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
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
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
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
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

describe("notes", () => {
    it("createNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().createNote })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.createNote.success).to.be.true
                done();
            })
    })

    it("updateNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().updateNote })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.updateNote.success).to.be.false
                done();
            })
    })

    it("removeNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().removeNote })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.removeNote.success).to.be.false
                done();
            })
    })

    it("addLabelNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().addLabelNote })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.addLabelNote.success).to.be.true
                done();
            })
    })

    it("removeLabelNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().removeLabelNote })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.removeLabelNote.success).to.be.true
                done();
            })
    })

    it("isArchive", done => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().isArchive })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.isArchive.success).to.be.true
                done();
            })
    })

    it("isTrash", done => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().isTrash })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.isTrash.success).to.be.true
                done();
            })
    })

    it("setReminder", done => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().setReminder })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.setReminder.success).to.be.true
                done();
            })
    })

    it("deleteReminder", done => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().deleteReminder })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.deleteReminder.success).to.be.true
                done();
            })
    })
})

describe("colaborators", () => {
    it("setColaborator", (done) => {
        test(process.env.URL)
        
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().setColaborator })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.setColaborator.success).to.be.true
                done();
            })
    })
    it("deleteColaborator", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({ "token": access_token })
            .send({ query: test1().deleteColaborator })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.deleteColaborator.success).to.be.true
                done();
            })
    })
})