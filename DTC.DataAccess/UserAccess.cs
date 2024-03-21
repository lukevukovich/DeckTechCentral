using DTC.Model;
using MongoDB.Driver;

namespace DTC.DataAccess {
    public class UserAccess : BaseAccess, IUserAccess
    {
        UserAccess() {
            //TODO figure out config shit
        }

        public async Task<User> GetUserByEmail(string email) {
            var collection = Connect<User>("User");

            return await collection.Find(x => x.Email == email).Limit(1).FirstAsync();
        }

        public async Task<User> GetUserById(Guid userId) {
            var collection = Connect<User>("User");

            return await collection.Find(x => x.Id == userId).Limit(1).FirstAsync();
        }

        public Task CreateUser(User user) {
            var collection = Connect<User>("User");

            return collection.InsertOneAsync(user);
        }
    }
}