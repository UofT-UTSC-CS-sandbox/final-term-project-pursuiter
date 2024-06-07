import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js'; // Ensure this path correctly points to your server.js file

describe('User Authentication', () => {
  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/signup')
        .send({
          userType: 'recruiter',
          email: 'test@example.com',
          password: 'password123',
          fullName: 'John Doe',
          companyName: 'Tech Corp'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User created');
    });

    it('should not create a user with the same email', async () => {
      await request(app)
        .post('/signup')
        .send({
          userType: 'recruiter',
          email: 'test@example.com',
          password: 'password123',
          fullName: 'John Doe',
          companyName: 'Tech Corp'
        });

      const res = await request(app)
        .post('/signup')
        .send({
          userType: 'recruiter',
          email: 'test@example.com',
          password: 'password123',
          fullName: 'John Doe',
          companyName: 'Tech Corp'
        });

      expect(res.status).to.equal(409);
      expect(res.body).to.have.property('message', 'User already exists');
    });
  });

  describe('POST /login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Login successful');
    });

    it('should not login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });
  });
});
