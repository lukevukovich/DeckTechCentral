using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model
{
    public class Card
    {
        [BsonId]
        [BsonRequired]
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonRequired]
        [BsonElement("oracle_id")]
        public Guid OracleId { get; set; }

        [BsonElement("multiverse_ids")]
        public int[] MultiverseIds { get; set; }

        [BsonElement("tcgplayer_id")]
        public int? TCGPlayerId { get; set; }

        [BsonElement("cardmarket_id")]
        public int? CardMarketId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }
        
        [BsonElement("lang")]
        public string Lang { get; set; }

        [BsonElement("release_at")]
        public DateTime ReleaseAt { get; set; }

        [BsonElement("uri")]
        public Uri Uri { get; set; }

        [BsonElement("scryfall_uri")]
        public Uri ScryfallUri { get; set; }

        [BsonElement("layout")]
        public string Layout { get; set; }

        [BsonElement("highres_image")]
        public bool HighResImage { get; set; }

        [BsonElement("image_status")]
        public string ImageStatus { get; set; }

        [BsonElement("image_uris")]
        public Uri[] ImageUris { get; set; }

        [BsonElement("cmc")]
        public int CMC { get; set; }

        [BsonElement("mana_cost")]
        public string ManaCost { get; set; }

        [BsonElement("type_line")]
        public string TypeLine { get; set; }

        [BsonElement("power")]
        public string? Power { get; set; }

        [BsonElement("toughness")]
        public string? Toughness { get; set; }

        [BsonElement("colors")]
        public string[] Colors { get; set; }

        [BsonElement("color_identity")]
        public string[] ColorIdentity { get; set; }

        [BsonElement("keywords")]
        public string[] Keywords { get; set; }

        [BsonElement("legalities")]
        public string[] Legalities { get; set; }

        [BsonElement("games")]
        public string[] Games { get; set; }

        [BsonElement("reserved")]
        public bool Reserved { get; set; }
        
        [BsonElement("foil")]
        public bool Foil { get; set; }

        [BsonElement("nonfoil")]
        public bool NonFoil { get; set; }

        [BsonElement("finishes")]
        public string[] Finishes { get; set; }

        [BsonElement("oversized")]
        public bool Oversized { get; set; }

        [BsonElement("promo")]
        public bool Promo { get; set; }

        [BsonElement("reprint")]
        public bool Reprint { get; set; }

        [BsonElement("variation")]
        public bool Variation { get; set; }

        [BsonElement("set_id")]
        public Guid SetId { get; set; }

        [BsonElement("set")]
        public string Set { get; set; }

        [BsonElement("set_name")]
        public string SetName { get; set; }

        [BsonElement("set_type")]
        public string SetType { get; set; }

        [BsonElement("rarity")]
        public string Rarity { get; set; }

        [BsonElement("artist")]
        public string Artist { get; set; }

        [BsonElement("card_faces")]
        public CardFace[]? CardFaces { get; set; }
    }
}