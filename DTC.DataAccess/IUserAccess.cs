namespace DTC.Model {
    public interface IUserAccess {

        public Task<User> GetUserByEmail(string email);

        public Task<User> GetUserById(Guid userId);

        public Task CreateUser(User user);
    }
}