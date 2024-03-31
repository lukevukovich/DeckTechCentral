using DTC.Model;

namespace DTC.Service {
    public interface IUserService
    {
        public Task<User> GetUserByEmail(string? email);

        public Task<User> GetUserById(Guid user);

        public Task CreateUser(User user);
    }
}