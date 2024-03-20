using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model
{
    public class CardInfo
    {
        [BsonId]
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("name")]
        public String Name { get; set; }

        [BsonElement("mana_cost")]
        public String ManaCost { get; set; }

        [BsonElement("cmc")]
        public int CMC { get; set; }

        [BsonElement("type_line")]
        public String TypeLine { get; set; }

        [BsonElement("image_uris")]
        public String[] ImageUris { get; set; }
    }
}