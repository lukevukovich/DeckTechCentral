using System.Collections.Specialized;

namespace DTC.Model {
    public class Deck
    {
        public Guid Id { get; set; }
        public String[] Editors { get; set; }
        public String Name { get; set; }
        public CardDeckResponse[] mainboard { get; set; }
        public CardDeckResponse[] sideboard { get; set; }
        public CardDeckResponse[] Considering { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public int Views { get; set; }
        public String Dictionary { get; set; }
        public Uri CoverImage { get; set; }
    }
}