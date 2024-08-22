using MyKanban.Domain;
using MyKanban.Application.Common;

namespace MyKanban.Application;

public class KanbanService : IKanbanService
{
    private readonly IRepository<Board> _boardRepository;
    private readonly IRepository<Mission> _missionRepository;

    public KanbanService(IRepository<Board> boardRepository, IRepository<Mission> missionRepository)
    {
        _boardRepository = boardRepository;
        _missionRepository = missionRepository;
    }

    public IEnumerable<Board> GetBoards() => _boardRepository.GetAll();

    public Board GetBoardById(Guid id) => _boardRepository.GetById(id);

    public void AddBoard(Board board) => _boardRepository.Add(board);

    public void UpdateBoard(Board board) => _boardRepository.Update(board);

    public void DeleteBoard(Guid boardId) => _boardRepository.Delete(boardId);

    public IEnumerable<Mission> GetMissions() => _missionRepository.GetAll();

    public Mission GetMissionById(Guid id) => _missionRepository.GetById(id);

    public void AddMission(Mission mission) => _missionRepository.Add(mission);

    public void UpdateMission(Mission mission) => _missionRepository.Update(mission);

    public void DeleteMission(Guid missionId) => _missionRepository.Delete(missionId);

    public void ReorderBoards(IEnumerable<Guid> boardIds)
    {
        var map = GetBoards().ToDictionary(board => board.Id, board => board);
        _boardRepository.Clear();
        foreach (var boardId in boardIds)
        {
            if (map.TryGetValue(boardId, out Board? value))
            {
                _boardRepository.Add(value);
            }
        }
    }
}