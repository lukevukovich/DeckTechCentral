using DTC.Model;

namespace DTC.DataAccess {
    public interface ICardAccess
    {
        public Task<Card> GetCardById(Guid id);

        public Task<List<Card>> GetCardBulk(List<Guid> guids);

        public Task CreateCard(Card card);
    }
}