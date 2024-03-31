using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class DeckCreationRequest
    {

        [BsonElement("name")]
        public string? Name { get; set; }

        [BsonElement("privacy")]
        public string Privacy { get; set; }

        [BsonElement("format")]
        public string? Format { get; set; }

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("cover_image")]
        public Uri? CoverImage { get; set; }

        [BsonElement("mainboard")]
        public List<Guid> Mainboard { get; set; }

        [BsonElement("sideboard")]
        public List<Guid> Sideboard { get; set; }

        [BsonElement("considering")]
        public List<Guid> Considering { get; set; }

        [BsonElement("commander_1")]
        public string? Commander1 { get; set; }

        [BsonElement("commander_2")]
        public string? Commander2 { get; set; }
    }
}