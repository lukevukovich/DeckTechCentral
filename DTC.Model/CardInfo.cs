namespace DTC.Model
{
    public class CardInfo
    {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public String ManaCost { get; set; }
        public int CMC { get; set; }
        public String TypeLine { get; set; }
        public String[] ImageUris { get; set; }
    }
}