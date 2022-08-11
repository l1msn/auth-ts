import request from 'supertest';
import app from '../app';


describe('Correct working a request validation handler', () => {
  test('Sending registration request and getting response - without body of request', async ()=> {
    const response: request.Response = await request(app).post('/auth/registration');
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      'message': 'Validation error!',
      'errors': [
        {
          'msg': 'must be at not empty',
          'param': 'email',
          'location': 'body',
        },
        {
          'msg': 'must be a email',
          'param': 'email',
          'location': 'body',
        },
        {
          'msg': 'must be at not empty',
          'param': 'password',
          'location': 'body',
        },
        {
          'msg': 'must be min 3 and max 30 characters',
          'param': 'password',
          'location': 'body',
        },
      ],
    });
  });
  test('Sending registration request and getting response - with wrong body format', async () => {
    const response: request.Response = await request(app).post('/auth/registration')
        .send({
          'email': 'chakachakovichgmail.com',
          'password': '1234',
        });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      'message': 'Validation error!',
      'errors': [
        {
          'value': 'chakachakovichgmail.com',
          'msg': 'must be a email',
          'param': 'email',
          'location': 'body',
        },
      ],
    });
  });
  test('Sending login request and getting response - without body of request', async ()=> {
    const response: request.Response = await request(app).post('/auth/login');
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      'message': 'Validation error!',
      'errors': [
        {
          'msg': 'must be at not empty',
          'param': 'email',
          'location': 'body',
        },
        {
          'msg': 'must be a email',
          'param': 'email',
          'location': 'body',
        },
        {
          'msg': 'must be at not empty',
          'param': 'password',
          'location': 'body',
        },
        {
          'msg': 'must be min 3 and max 30 characters',
          'param': 'password',
          'location': 'body',
        },
      ],
    });
  });
  test('Sending login request and getting response - with wrong body format', async () => {
    const response: request.Response = await request(app).post('/auth/login')
        .send({
          'email': 'chakachakovichgmail.com',
          'password': '1234',
        });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      'message': 'Validation error!',
      'errors': [
        {
          'value': 'chakachakovichgmail.com',
          'msg': 'must be a email',
          'param': 'email',
          'location': 'body',
        },
      ],
    });
  });
});


