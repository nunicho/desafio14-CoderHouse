const UserModel = require("./DB/models/users.modelo.js");

class UsersMongoDao {
  async createUser(userData) {
    try {
      const user = await UserModel.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(
        "Error al obtener usuario por correo electrónico desde la base de datos"
      );
    }
  }

  async getUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error("Error al obtener usuarios desde la base de datos");
    }
  }

  async updateUser(userId, userData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw new Error("Error al actualizar usuario en la base de datos");
    }
  }

  async deleteUser(userId) {
    try {
      await UserModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error("Error al eliminar usuario desde la base de datos");
    }
  }

  async getUserByEmailRegister({ email }) {
    try {
      await UserModel.findOne({ email });
    } catch (error) {
      throw new Error("El correo electrónico ya está registrado");
    }
  }
}

module.exports = new UsersMongoDao();
