using DTC.Model;
using DTC.DataAccess;

namespace DTC.Service {
    public class UserService : IUserService
    {

        IUserAccess access;
        public UserService() {
            access = new UserAccess();
        }

        public Task<User> GetUserByEmail(string? email) {
            if(email == null) throw new Exception("invalid email");
            if(!email.Contains('@')) throw new Exception("invalid email");

            return access.GetUserByEmail(email);
        }

        public Task<User> GetUserById(Guid id) {
            return access.GetUserById(id);
        }

        public Task CreateUser(User user) {
            if(user.Username == null || user.Email == null) throw new Exception("Invalid user");
            if(user.UserStatus == null) user.UserStatus = "default";

            return access.CreateUser(user); 
        }
    }
}