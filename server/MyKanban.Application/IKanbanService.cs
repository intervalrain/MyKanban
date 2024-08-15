using MyKanban.Domain;

namespace MyKanban.Application;

public interface IKanbanService
{
    void AddBoard(Board board);
    void AddMission(Mission mission);
    void DeleteBoard(Guid boardId);
    void DeleteMission(Guid missionId);
    Board GetBoardById(Guid id);
    IEnumerable<Board> GetBoards();
    Mission GetMissionById(Guid id);
    IEnumerable<Mission> GetMissions();
    void UpdateBoard(Board board);
    void UpdateMission(Mission mission);
}