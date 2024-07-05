const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../app'); // assuming your express app is exported from app.js
const User = require('../models/userModel');
const { expect } = chai;

chai.use(chaiHttp);

describe('User Controller', () => {
  let userStub;

  beforeEach(() => {
    userStub = sinon.stub(User, 'find');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('searchUser', () => {
    it('should return a list of users matching the query', async () => {
      const mockUsers = [
        { fullname: 'John Doe', username: 'johndoe', avatar: 'avatar1.png' },
        { fullname: 'Jane Doe', username: 'janedoe', avatar: 'avatar2.png' },
      ];
      userStub.returns(Promise.resolve(mockUsers));

      const res = await chai.request(app).get('/api/users/search').query({ username: 'doe' });
      expect(res).to.have.status(200);
      expect(res.body.users).to.be.an('array').that.has.length(2);
      expect(res.body.users[0]).to.include({ fullname: 'John Doe', username: 'johndoe', avatar: 'avatar1.png' });
    });

    it('should handle errors gracefully', async () => {
      userStub.throws(new Error('Database error'));

      const res = await chai.request(app).get('/api/users/search').query({ username: 'doe' });
      expect(res).to.have.status(500);
    });
  });

  describe('getUser', () => {
    let userFindOneStub;

    beforeEach(() => {
      userFindOneStub = sinon.stub(User, 'findOne');
    });

    it('should return user details excluding password', async () => {
      const mockUser = {
        fullname: 'John Doe',
        username: 'johndoe',
        avatar: 'avatar1.png',
        followers: [],
        following: [],
      };
      userFindOneStub.withArgs({ username: 'johndoe' }).returns(Promise.resolve(mockUser));

      const res = await chai.request(app).get('/api/users/johndoe');
      expect(res).to.have.status(200);
      expect(res.body).to.include({ fullname: 'John Doe', username: 'johndoe', avatar: 'avatar1.png' });
    });

    it('should handle user not found', async () => {
      userFindOneStub.withArgs({ username: 'notfound' }).returns(Promise.resolve(null));

      const res = await chai.request(app).get('/api/users/notfound');
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal('User does not exist.');
    });

    it('should handle errors gracefully', async () => {
      userFindOneStub.throws(new Error('Database error'));

      const res = await chai.request(app).get('/api/users/johndoe');
      expect(res).to.have.status(500);
    });
  });

  describe('getSuggestionUser', () => {
    let userFindByIdStub;

    beforeEach(() => {
      userFindByIdStub = sinon.stub(User, 'findById');
      userStub = sinon.stub(User, 'find');
    });

    it('should return a list of suggested users', async () => {
      const currentUserMock = {
        _id: '1',
        following: ['2'],
      };
      userFindByIdStub.withArgs('1').returns(Promise.resolve(currentUserMock));

      const mockUsers = [
        { fullname: 'Jane Doe', username: 'janedoe', avatar: 'avatar2.png' },
      ];
      userStub.withArgs({
        _id: { $nin: currentUserMock.following, $ne: currentUserMock._id },
      }).returns(Promise.resolve(mockUsers));

      const res = await chai.request(app).get('/api/users/suggestions').set('Authorization', 'Bearer token');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').that.has.length(1);
      expect(res.body[0]).to.include({ fullname: 'Jane Doe', username: 'janedoe', avatar: 'avatar2.png' });
    });

    it('should handle errors gracefully', async () => {
      userFindByIdStub.withArgs('1').throws(new Error('Database error'));

      const res = await chai.request(app).get('/api/users/suggestions').set('Authorization', 'Bearer token');
      expect(res).to.have.status(500);
    });
  });

  describe('followUser', () => {
    let userFindOneAndUpdateStub;

    beforeEach(() => {
      userStub = sinon.stub(User, 'find');
      userFindOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
    });

    it('should follow a user successfully', async () => {
      const mockUser = {
        _id: '2',
        followers: ['1'],
      };
      userStub.withArgs({ _id: '2', followers: '1' }).returns(Promise.resolve([]));
      userFindOneAndUpdateStub.withArgs(
        { _id: '2' },
        { $push: { followers: '1' } },
        { new: true }
      ).returns(Promise.resolve(mockUser));

      const res = await chai.request(app).post('/api/users/follow/2').set('Authorization', 'Bearer token');
      expect(res).to.have.status(200);
    });

    it('should not allow following an already followed user', async () => {
      const mockUser = { _id: '2', followers: ['1'] };
      userStub.withArgs({ _id: '2', followers: '1' }).returns(Promise.resolve([mockUser]));

      const res = await chai.request(app).post('/api/users/follow/2').set('Authorization', 'Bearer token');
      expect(res).to.have.status(500);
      expect(res.body.msg).to.equal('You followed this user.');
    });

    it('should handle errors gracefully', async () => {
      userStub.throws(new Error('Database error'));

      const res = await chai.request(app).post('/api/users/follow/2').set('Authorization', 'Bearer token');
      expect(res).to.have.status(500);
    });
  });

  describe('unfollowUser', () => {
    let userFindOneAndUpdateStub;

    beforeEach(() => {
      userFindOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
    });

    it('should unfollow a user successfully', async () => {
      const mockUser = {
        _id: '2',
        followers: ['1'],
      };
      userFindOneAndUpdateStub.withArgs(
        { _id: '2' },
        { $pull: { followers: '1' } },
        { new: true }
      ).returns(Promise.resolve(mockUser));

      const res = await chai.request(app).post('/api/users/unfollow/2').set('Authorization', 'Bearer token');
      expect(res).to.have.status(200);
    });

    it('should handle errors gracefully', async () => {
      userFindOneAndUpdateStub.throws(new Error('Database error'));

      const res = await chai.request(app).post('/api/users/unfollow/2').set('Authorization', 'Bearer token');
      expect(res).to.have.status(500);
    });
  });

  describe('savePost', () => {
    let userFindOneAndUpdateStub;

    beforeEach(() => {
      userStub = sinon.stub(User, 'find');
      userFindOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
    });

    it('should save a post successfully', async () => {
      const mockUser = {
        _id: '1',
        saved: ['3'],
      };
      userStub.withArgs({ _id: '1', saved: '3' }).returns(Promise.resolve([]));
      userFindOneAndUpdateStub.withArgs(
        { _id: '1' },
        { $push: { saved: '3' } },
        { new: true }
      ).returns(Promise.resolve(mockUser));

      const res = await chai.request(app).post('/api/posts/save/3').set('Authorization', 'Bearer token');
      expect(res).to.have.status(200);
    });

    it('should not allow saving an already saved post', async () => {
      const mockUser = { _id: '1', saved: ['3'] };
      userStub.withArgs({ _id: '1', saved: '3' }).returns(Promise.resolve([mockUser]));

      const res = await chai.request(app).post('/api/posts/save/3').set('Authorization', 'Bearer token');
      expect(res).to.have.status(400);
      expect(res.body.msg).to.equal('You saved this post.');
    });

    it('should handle errors gracefully', async () => {
      userStub.throws(new Error('Database error'));

      const res = await chai.request(app).post('/api/posts/save/3').set('Authorization', 'Bearer token');
      expect(res).to.have.status(500);
    });
  });

  describe('unSavePost', () => {
    let userFindOneAndUpdateStub;

    beforeEach(() => {
      userFindOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
    });

    it('should unsave a post successfully', async () => {
      const mockUser = {
        _id: '1',
        saved: ['3'],
      };
      userFindOneAndUpdateStub.withArgs(
        { _id: '1' },
        { $pull: { saved: '3' } },
        { new: true }
      ).returns(Promise.resolve(mockUser));

      const res = await chai.request(app).post('/api/posts/unsave/3').set('Authorization', 'Bearer token');
      expect(res).to.have.status(200);
    });

    it('should handle errors gracefully', async () => {
      userFindOneAndUpdateStub.throws(new Error('Database error'));

      const res = await chai.request(app).post('/api/posts/unsave/3').set('Authorization', 'Bearer token');
      expect(res).to.have.status(500);
    });
  });
});
