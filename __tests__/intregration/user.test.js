import request from 'supertest';

import bcrypt from 'bcryptjs';
import app from '../../src/app';

import User from '../../src/app/models/User';

import truncate from '../utils/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be encrypted password', async () => {
    const user = await User.create({
      name: 'Renan Melo',
      email: 'adm@mail.com',
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Renan Melo',
        email: 'adm@mail.com',
        password_hash: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not able to register duplicate email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Renan Melo',
        email: 'adm@mail.com',
        password_hash: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Renan Melo',
        email: 'adm@mail.com',
        password_hash: '123456',
      });

    expect(response.status).toBe(400);
  });
});
