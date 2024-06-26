using DTC.Model;
using MongoDB.Driver;

namespace DTC.DataAccess {
    public class CardAccess : BaseAccess, ICardAccess
    {

        public async Task<Card> GetCardById(Guid id) 
        {
            var collection = Connect<Card>("Card");

            var results = await collection.FindAsync(x => x.Id == id);
            if(results.Current == null) return null;

            return results.First();
        }

        public async Task<List<Card>> GetCardBulk(List<Guid> guids) 
        {
            var collection = Connect<Card>("Card");

            var filter = Builders<Card>.Filter.In(f => f.Id, guids);

            var results = await collection.FindAsync(filter);

            return results.ToList();
        }

        public Task CreateCard(Card card) 
        {
            var collection = Connect<Card>("Card");

            return collection.InsertOneAsync(card);
        }

        public Task CreateCardBulk(List<Card> cards) {
            var collection = Connect<Card>("Card");

            return collection.InsertManyAsync(cards);
        }
    }
}