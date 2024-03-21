using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class DeckSearchResponse
    {
        [BsonId]
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("editors")]
        public List<User> Editors { get; set; }

        [BsonElement("name")]
        public String Name { get; set; }

        [BsonElement("format")]
        public String Format { get; set; }

        [BsonElement("likes")]
        public int Likes { get; set; }

        [BsonElement("dislikes")]
        public int Dislikes { get; set; }

        [BsonElement("views")]
        public int Views { get; set; }

        [BsonElement("cover_image")]
        public Uri CoverImage { get; set; }

        [BsonElement("created_date")]
        public DateTime CreatedDate { get; set; }

        [BsonElement("modified_date")]
        public DateTime ModifiedDate { get; set; }
    }
}