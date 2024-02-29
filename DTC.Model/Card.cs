namespace DTC.Model
{
    public class Card
    {
        public Guid Id { get; set; }
        public Guid OracleId { get; set; }
        public Guid[] MultiverseIds { get; set; }
        public int TCGPlayerId { get; set; }
        public int CardMarketId { get; set; }
        public string Name { get; set; }
        public DateTime ReleaseAt { get; set; }
        public Uri Uri { get; set; }
        public Uri ScryfallUri { get; set; }
        public string Layout { get; set; }
        public bool HighResImage { get; set; }
        public string ImageStatus { get; set; }
        public string CastingCost { get; set; }
        public int CMC { get; set; }
        public string ManaCost { get; set; }
        public string TypeLine { get; set; }
        public string[] ImageUris { get; set; }
        public int Power { get; set; }
        public int Toughness { get; set; }
        public char[] Colors { get; set; }
        public char[] ColorIdentity { get; set; }
        public string[] Keywords { get; set; }
        public string[] Legalities { get; set; }
        public string[] Games { get; set; }
        public bool Reserved { get; set; }
        public bool Foil { get; set; }
        public bool NonFoil { get; set; }
        public string[] Finishes { get; set; }
        public bool Oversized { get; set; }
        public bool Promo { get; set; }
        public bool Reprint { get; set; }
        public bool Variation { get; set; }
        public Guid SetId { get; set; }
        public string Set { get; set; }
        public string SetName { get; set; }
        public string Rarity { get; set; }
        public string Artist { get; set; }
    }
}