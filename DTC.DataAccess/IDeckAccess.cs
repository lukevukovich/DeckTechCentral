using DTC.Model;

namespace DTC.DataAccess {
    public interface IDeckAccess 
    {
        public Task<List<Deck>> SearchDeck(string? name, string? format, string? commander1, string? commander2, string? sortBy);

        public Task CreateDeck(Deck deck);

        public Task<Deck> GetDeck(Guid deckId);

        public Task<List<Deck>> GetDecksForUser(User user);
    }
}