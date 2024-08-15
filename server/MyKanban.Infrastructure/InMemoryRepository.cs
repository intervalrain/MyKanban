using MyKanban.Application.Common;
using MyKanban.Domain.Common;

namespace MyKanban.Infrastructure;

public class InMemoryRepository<T> : IRepository<T> where T : Entity
{
    private static List<T> _data;

    public InMemoryRepository()
    {
        _data = new List<T>();
    }

    public IEnumerable<T> GetAll()
    {
        return _data;
    }

    public T GetById(Guid id)
    {
        return _data.Find(entity => GetId(entity).Equals(id));
    }

    public void Add(T entity)
    {
        _data.Add(entity);
    }

    public void Update(T entity)
    {
        var existing = GetById(entity.Id);
        if (existing != null)
        {
            var index = _data.IndexOf(existing);
            _data[index] = entity;
        }
    }

    public void Delete(Guid id)
    {
        var entity = GetById(id);
        if (entity != null)
        {
            _data.Remove(entity);
        }
    }

    private Guid GetId(T entity)
    {
        return entity.Id;
    }
}
