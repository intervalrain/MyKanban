using MyKanban.Domain.Common;

namespace MyKanban.Domain;

public class Mission : Entity
{
	public string Title { get; set; }
	public string Category { get; set; }
	public Guid BoardId { get; set; }
	public int Urgency { get; set; }
	public string Content { get; set; }
	public DateTime CreatedDate { get; set; }
	public DateTime DueDate { get; set; }
	public int TimeNeed { get; set; }

	public Mission(string title, string category, Guid boardId, int urgency, string content, DateTime createdDate, DateTime dueDate, int timeNeed) : base(Guid.NewGuid())
	{
        Title = title;
        Category = category;
        BoardId = boardId;
        Urgency = urgency;
        Content = content;
        CreatedDate = createdDate;
        DueDate = dueDate;
        TimeNeed = timeNeed;
    }
}