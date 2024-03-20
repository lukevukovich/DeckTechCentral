using DTC.Model;

namespace DTC.DataAccess {
    public interface ICardAccess
    {
        public Task<Card> GetCardById(Guid id);

        public Task<List<Card>> GetCardBulk(List<Guid> guids);

        public Task<List<Card>> SearchCard(string q, int page, int pageSzie);

        public Task CreateCard(Card card);
    }
}