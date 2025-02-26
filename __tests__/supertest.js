const request = require('supertest');
const server = 'http://localhost:3000';

//Route integration tests
describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      //May not work because of how long it takes to query an API
      // it('/questions responds with 200 status and Application/JSON content type', () => {
      //   return request(server)
      //     .get('/questions')
      //     .expect(200)
      //     .expect('Content-Type', /application\/json/);
      // });
      // it('/questions returns an object of arrays', async () => {
      //   const response = await request(server).get('/questions');
      //   console.log(response._body);
      //   expect(Object.keys(response._body).length === 0).toBeTruthy();
      // });
    });
    describe('POST & DELETE', () => {
      const userObj = {
        username: 'Jaime123Jaime',
        password: '12345678',
      };
      it('/sign-up returns a JWT token and a new user object', async () => {
        const response = await request(server).post('/sign-up').send(userObj);
        expect(Object.hasOwn(response._body, 'jwtToken')).toBeTruthy();
        expect(response._body.user.username).toEqual(userObj.username);
      });
      it('/log-in returns an existing user in the database', async () => {
        const response = await request(server).post('/log-in').send(userObj);
        expect(response._body.user.username).toEqual(userObj.username);
      });
      it('/delete deletes a user from the database', async () => {
        const response = await request(server).delete('/delete').send(userObj);
        expect(response._body).toEqual(
          'You successfully deleted your account.'
        );
      });
    });
  });
});
