using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class DeckCreationRequest
    {

        [BsonElement("Privacy")]
        public string? Privacy { get; set; }

        [BsonElement("name")]
        public string? Name { get; set; }

        [BsonElement("format")]
        public string? Format { get; set; }

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("cover_image")]
        public string? CoverImage { get; set; }

        [BsonElement("mainboard")]
        public List<CreationCardAmmount> Mainboard { get; set; }

        [BsonElement("sideboard")]
        public List<CreationCardAmmount>? Sideboard { get; set; }

        [BsonElement("considering")]
        public List<CreationCardAmmount>? Considering { get; set; }
    }
}