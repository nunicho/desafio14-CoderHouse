const UsersMongoDao = require("../usersMongoDao.js");

class UserRepository {
  async createUser(userData) {
    return await UsersMongoDao.createUser(userData);
  }

  async getUserByEmail(email) {
    return await UsersMongoDao.getUserByEmail(email);
  }

  async getUsers() {
    return await UsersMongoDao.getUsers();
  }

  async updateUser(userId, userData) {
    return await UsersMongoDao.updateUser(userId, userData);
  }

  async deleteUser(userId) {
    return await UsersMongoDao.deleteUser(userId);
  }

  async getUserByEmailRegister(email) {
    return await UsersMongoDao.getUserByEmailRegister(email);
  }
}

module.exports = new UserRepository();
