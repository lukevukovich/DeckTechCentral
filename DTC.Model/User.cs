using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class User
    {
        [BsonId]
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("username")]
        public String Username { get; set; }

        [BsonElement("email")]
        public String Email { get; set; }

        [BsonElement("userStatus")]
        public String UserStatus { get; set; }
    }
}