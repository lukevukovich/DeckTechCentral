using DTC.Model;
using Microsoft.VisualBasic;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace DTC.DataAccess {
    public class DeckAccess : BaseAccess, IDeckAccess
    {

        public async Task<List<Deck>> SearchDeck(string? name, string? format, string? commander1, string? commander2, string? sortBy) 
        {
            var collection = Connect<Deck>("Deck");
            
            var builder = Builders<Deck>.Filter;
            var filter = builder.Eq(f => f.Commander1, commander1) & builder.Eq(f => f.Name, name) & builder.Eq(f => f.Commander2, commander2) & builder.Eq(f => f.Format, format);

            var results = await collection.FindAsync(filter);

            return results.ToList();
        }

        public Task CreateDeck(Deck deck) {
            var collection = Connect<Deck>("Deck");

            return collection.InsertOneAsync(deck);
        }

        public async Task<Deck> GetDeck(Guid deckId) {
            var collection = Connect<Deck>("Deck");

            return await collection.Find(x => x.Id == deckId).Limit(1).FirstAsync();
        }

        public async Task<List<Deck>> GetDecksForUser(User user) {
            var collection = Connect<Deck>("Deck");

            var results = await collection.FindAsync(f => f.Editors.Contains(user));

            return results.ToList();
        }

        public async Task DeleteDeck(Guid deckId) {
            var collection = Connect<Deck>("Deck");

            var results =  await collection.DeleteOneAsync(f => f.Id == deckId);
        }

        private List<CardDeckResponse> GenerateCardDeckResponse(List<string> cards) {
            return null; //TODO make this work
        }
    }
}