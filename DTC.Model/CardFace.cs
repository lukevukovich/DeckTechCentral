using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class CardFace
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("image_uris")]
        public Uri[] ImageUris { get; set; }

        [BsonElement("mana_cost")]
        public string ManaCost { get; set; }

        [BsonElement("type_line")]
        public string TypeLine { get; set; }

        [BsonElement("colors")]
        public string[] Colors { get; set; }

        [BsonElement("power")]
        public string? Power { get; set; }

        [BsonElement("toughness")]
        public string? Toughness { get; set; }
    }
}