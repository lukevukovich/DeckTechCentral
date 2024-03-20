using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model
{
    public class CardDeckResponse
    {
        [BsonElement("number")]
        public int Number { get; set; }

        [BsonElement("CardInfo")]
        public Card CardInfo { get; set; }
    }
}