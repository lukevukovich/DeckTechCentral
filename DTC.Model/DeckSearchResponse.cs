namespace DTC.Model {
    public class DeckSearchResponse
    {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public Uri CoverImage { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public int Views { get; set; }
        public String Format { get; set; }
        public String[] Editors { get; set; }
    }
}