const chai = require('chai')
const expect = chai.expect;
const test = require('supertest');

describe('login test', () =>
    it('login', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .send({ query: 'mutation{login(email:"akshaykc27@gmail.com",password :"123456789"){message}}' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(JSON.parse(res.text).data.login.message).to.deep.equal(
                    "login successful "
                )
                done();
            })
    }))

describe('registration test', () =>
    it('register', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .send({ query: 'mutation{signUp(firstName:"akshay",lastName:"kc",email:"akshaykc270007@gmail.com", password :"12345678"){message}}' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(JSON.parse(res.text).data.signUp.message).to.deep.equal(
                    "registration successful"
                )
                done();
            })
    }))

describe('forgot password test', () => {
    it('forgotPassword', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .send({ query: 'mutation{forgotPassword(email:"akshaykc27@gmail.com"){message}}' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(JSON.parse(res.text).data.forgotPassword.message).to.deep.equal(
                    "A link to reset your password has been sent to your email"
                )
                done();
            })
    })

})

describe('resetPassword test', () => {
    it('resetPassword', (done) => {
        test("http://localhost:4000")
            .post('/graphql')
            .send({ query: 'mutation{resetPassword(password:"12345678",confirmPassword:"12345678"){message}' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(JSON.parse(res.text).data.resetPassword.message).to.deep.equal("password reset successful")
                done();
            })
    })
})