using DTC.Model;

namespace DTC.DataAccess {
    public interface IDeckAccess 
    {
        public Task<List<Deck>> SearchDeck(string? name, string? format, string? sortBy);

        public Task CreateDeck(Deck deck);
        
        public Deck UpdateDeck(Guid deckId, Deck deck);

        public Task<Deck> GetDeck(Guid deckId);

        public Task<List<Deck>> GetDecksForUser(string Username);
    }
}