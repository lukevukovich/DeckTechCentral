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

        public Deck CreateDeck(Deck deck) {
            var collection = Connect<Deck>("Deck");

            var result = collection.InsertOneAsync(deck);

            var builder = Builders<Deck>.Filter;

            var filter = builder.Eq(f => f.Name, deck.Name) & builder.Eq(f => f.Description, deck.Description) & builder.Eq(f => f.CreatedDate, deck.CreatedDate);
            return collection.Find(filter).FirstOrDefault();
        }

        public Deck UpdateDeck(Guid deckId, DeckCreationRequest deck) {
            var collection = Connect<Deck>("Deck");

            var update = Builders<Deck>.Update.Set(f => f.Name, deck.Name)
                                              .Set(f => f.Privacy, deck.Privacy)
                                              .Set(f => f.Format, deck.Format)
                                              .Set(f => f.Description, deck.Description)
                                              .Set(f => f.CoverImage, deck.CoverImage)
                                              .Set(f => f.Mainboard, deck.Mainboard)
                                              .Set(f => f.Sideboard, deck.Sideboard)
                                              .Set(f => f.Considering, deck.Considering)
                                              .Set(f => f.ModifiedDate, DateTime.Today);

            collection.UpdateOne<Deck>(f => f.Id == deckId, update);
            return collection.Find(f=> f.Id.Equals(deckId)).Limit(1).FirstOrDefault();
        }

        public async Task<Deck> GetDeck(Guid deckId) {
            var collection = Connect<Deck>("Deck");

            return await collection.Find(x => x.Id.Equals(deckId)).Limit(1).FirstOrDefaultAsync();
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

        public bool? LikeDeck(Guid deckId, string Username) { //This should nnot have this should not have this much logic
            var collection = Connect<Deck>("Deck");
            var filter = Builders<Deck>.Filter.Eq(f => f.Id, deckId);
            
            var result = collection.Find(filter).Limit(1).FirstOrDefault();
            if(result == null) return null;

            var liked = result.LikedUsernames.Contains(Username);
            if(liked) {
                result.LikedUsernames.Remove(Username);
                var update = Builders<Deck>.Update.Inc(f=> f.Likes, -1);
                collection.UpdateOne(filter, update);
            }
            else {
                result.LikedUsernames.Add(Username);
                var update = Builders<Deck>.Update.Inc(f => f.Likes, 1);
                collection.UpdateOne(filter, update);
            }

            return !liked;
        }
    }
}