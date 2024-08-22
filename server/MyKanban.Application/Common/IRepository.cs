using MyKanban.Domain.Common;

namespace MyKanban.Application.Common;

public interface IRepository<T> where T : Entity
{
    void Add(T entity);
    void Delete(Guid id);
    IEnumerable<T> GetAll();
    T GetById(Guid id);
    void Update(T entity);
    void Clear();
}