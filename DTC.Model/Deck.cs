using System.Collections.Specialized;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace DTC.Model {
    public class Deck
    {
        [BsonId(IdGenerator = typeof(ObjectIdGenerator))]
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("editors")]
        public List<User> Editors { get; set; }

        [BsonElement("name")]
        public string? Name { get; set; }

        [BsonElement("format")]
        public string? Format { get; set; }

        [BsonElement("likes")]
        public int Likes { get; set; }

        [BsonElement("dislikes")]
        public int Dislikes { get; set; }

        [BsonElement("views")]
        public int Views { get; set; }

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("cover_image")]
        public Uri CoverImage { get; set; }

        [BsonElement("mainboard")]
        public List<CardDeckResponse> Mainboard { get; set; }

        [BsonElement("sideboard")]
        public List<CardDeckResponse> Sideboard { get; set; }

        [BsonElement("considering")]
        public List<CardDeckResponse> Considering { get; set; }

        [BsonElement("created_date")]
        public DateTime CreatedDate { get; set; }

        [BsonElement("modified_date")]
        public DateTime ModifiedDate { get; set; }

        [BsonElement("commander_1")]
        public string? Commander1 { get; set; }

        [BsonElement("commander_2")]
        public string? Commander2 { get; set; }
    }
}