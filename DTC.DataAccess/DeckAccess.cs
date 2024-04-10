using System.Data.Common;
using Amazon.Util.Internal;
using DTC.Model;
using Microsoft.VisualBasic;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using ZstdSharp.Unsafe;

namespace DTC.DataAccess {
    public class DeckAccess : BaseAccess, IDeckAccess
    {

        public async Task<List<Deck>> SearchDeck(string? name, string? format, string? commander1, string? commander2, string? sortBy) 
        {
            var collection = Connect<Deck>("Deck");
            
            var builder = Builders<Deck>.Filter;
            //var filter = builder.Regex(f => f.Name, ".*" + name == null ? name : "" + ".*");
            var filter = name != null ? builder.Regex(f => f.Name, $".*{name}.*") : builder.Regex(f => f.Name, ".*");
            filter &= format != null ? builder.Regex(f => f.Format, format) : builder.Regex(f => f.Format, ".*");
            filter &= commander1 != null ? builder.Regex(f => f.Commander1, commander1) : builder.Regex(f => f.Commander1, ".*") | builder.Eq(f => f.Commander1, null);
            filter &= commander2 != null ? builder.Regex(f => f.Commander2, commander2) : builder.Regex(f => f.Commander2, ".*") | builder.Eq(f => f.Commander2, null);

            var results = await collection.FindAsync(filter);

            return results.ToList();
        }

        public Task CreateDeck(Deck deck) {
            var collection = Connect<Deck>("Deck");

            return collection.InsertOneAsync(deck);
        }

        public Deck UpdateDeck(Guid deckId, Deck deck) {
            var collection = Connect<Deck>("Deck");

            collection.ReplaceOne<Deck>(f => f.Id == deckId, deck);
            return collection.Find(f=> f.Id.Equals(deckId)).Limit(1).First();
        }

        public async Task<Deck> GetDeck(Guid deckId) {
            var collection = Connect<Deck>("Deck");

            return await collection.Find(x => x.Id.Equals(deckId)).Limit(1).FirstAsync();
        }

        public async Task<List<Deck>> GetDecksForUser(Guid userId) {
            var collection = Connect<Deck>("Deck");

            var results = await collection.FindAsync(f => f.Editors.Where(u => u.Id.Equals(userId)).Count() > 0);

            return results.ToList();
        }

        public async Task DeleteDeck(Guid deckId) {
            var collection = Connect<Deck>("Deck");

            var results =  await collection.DeleteOneAsync(f => f.Id.Equals(deckId));
        }
    }
}