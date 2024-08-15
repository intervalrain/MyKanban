using MyKanban.Application;
using MyKanban.Domain;

namespace MyKanban.Api;

public class MockKanbanService : IKanbanService
{
    private static readonly Dictionary<Guid, Board> _boards = new();
    private static readonly Dictionary<Guid, Mission> _missions = new();

    public void AddBoard(Board board)
    {
        _boards.Add(board.Id, board);
    }

    public void AddMission(Mission mission)
    {
        _missions.Add(mission.Id, mission);
    }

    public void DeleteBoard(Guid boardId)
    {
        _boards.Remove(boardId);
    }

    public void DeleteMission(Guid missionId)
    {
        _missions.Remove(missionId);
    }

    public Board GetBoardById(Guid id)
    {
        return _boards.TryGetValue(id, out var board) ? board : throw new KeyNotFoundException();
    }

    public IEnumerable<Board> GetBoards()
    {
        return _boards.Select(x => x.Value);
    }

    public Mission GetMissionById(Guid id)
    {
        return _missions.TryGetValue(id, out var mission) ? mission : throw new KeyNotFoundException();
    }

    public IEnumerable<Mission> GetMissions()
    {
        return _missions.Select(x => x.Value);
    }

    public void UpdateBoard(Board board)
    {
        _boards[board.Id] = board;
    }

    public void UpdateMission(Mission mission)
    {
        _missions[mission.Id] = mission;
    }
}