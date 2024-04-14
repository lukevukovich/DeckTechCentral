using DTC.Model;

namespace DTC.Service {
    public interface IUserService
    {
        public Task<User> GetUserByEmail(string? email);

        public Task<User> GetUserById(Guid user);

        public bool CreateUser(CreateNewUser user);

        public AuthenticateResponse Authenticate(AuthenticateRequest request);
    }
}