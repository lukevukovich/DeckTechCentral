using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class DeckResponse
    {
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("editors")]
        public List<User> Editors { get; set; }

        [BsonElement("privacy")]
        public string Privacy { get; set; }

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
        public List<(int, Card)> Mainboard { get; set; }

        [BsonElement("sideboard")]
        public List<(int, Card)> Sideboard { get; set; }

        [BsonElement("considering")]
        public List<(int, Card)> Considering { get; set; }

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