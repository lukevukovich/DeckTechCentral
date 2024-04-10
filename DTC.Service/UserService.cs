using DTC.Model;
using DTC.DataAccess;
using System.Net;

namespace DTC.Service {
    public class UserService : IUserService
    {

        UserAccess access;
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

        public void CreateUser(CreateNewUser user) {
            if(user.Username == null || user.Email == null) throw new Exception("invalid user");
            
            access.CreateUser(new User() {
                Username = user.Username,
                Email = user.Email,
                UserStatus = "standard"
            });
        }
    }
}