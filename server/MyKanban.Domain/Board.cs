using MyKanban.Domain.Common;

namespace MyKanban.Domain;

public class Board : Entity
{
    public string Name { get; set; }

    public Board(string name) : base(Guid.NewGuid())
    {
        Name = name;
    }
}