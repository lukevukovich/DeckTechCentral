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

        public async Task<List<Deck>> SearchDeck(string? name, string? format, string? sortBy) 
        {
            var collection = Connect<Deck>("Deck");
            
            var builder = Builders<Deck>.Filter;
            //var filter = builder.Regex(f => f.Name, ".*" + name == null ? name : "" + ".*");
            var filter = name != null ? builder.Regex(f => f.Name, $".*{name}.*") : builder.Regex(f => f.Name, ".*");
            filter &= format != null ? builder.Regex(f => f.Format, format) : builder.Regex(f => f.Format, ".*");

            var results = await collection.FindAsync(filter);

            return results.ToList();
        }

        public void AddView(Guid deckId) {
            var collection = Connect<Deck>("Deck");
            var filter = Builders<Deck>.Filter.Eq(f => f.Id, deckId);
            var update = Builders<Deck>.Update.Inc(f => f.Views, 1);

            collection.UpdateOne(filter, update);
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

        public async Task<List<Deck>> GetDecksForUser(string Username) {
            var collection = Connect<Deck>("Deck");

            var results = await collection.FindAsync(f => f.Editors.Contains(Username));

            return results.ToList();
        }

        public async Task DeleteDeck(Guid deckId) {
            var collection = Connect<Deck>("Deck");

            var results =  await collection.DeleteOneAsync(f => f.Id.Equals(deckId));
        }
    }
}