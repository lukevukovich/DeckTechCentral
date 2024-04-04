using MongoDB.Driver;

namespace DTC.DataAccess {
    public class BaseAccess {

        private string ConString { get; } = "mongodb://localhost:27017/";

        private string DB { get; } = "DTC";

        /// <summary>
        /// Connects to a given collection of type T
        /// </summary>
        /// <typeparam name="T">Bson Model to wrap results in</typeparam>
        /// <param name="collection">Name of Collection to get</param>
        /// <returns>IMongoCollection of the given collection</returns>
        protected IMongoCollection<T> Connect<T>(string collection) {
            var client = new MongoClient(ConString);
            var db = client.GetDatabase(DB);
            return db.GetCollection<T>(collection);
        }
    }
}