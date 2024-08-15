using Microsoft.AspNetCore.Mvc;
using MyKanban.Application;
using MyKanban.Domain;

namespace MyKanban.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class KanbanController : ControllerBase
{
    private readonly IKanbanService _kanbanService;

    public KanbanController(IKanbanService kanbanService)
    {
        _kanbanService = kanbanService;
    }

    // TEST
    [HttpGet("test")]
    public ActionResult<string> Test()
    {
        return Ok("Test successful");
    }


    // GET: api/Kanban/boards
    [HttpGet("boards")]
    public ActionResult<IEnumerable<Board>> GetBoards()
    {
        var boards = _kanbanService.GetBoards();
        return Ok(boards);
    }

    // GET: api/Kanban/boards/{id}
    [HttpGet("boards/{id}")]
    public ActionResult<Board> GetBoard(Guid id)
    {
        var board = _kanbanService.GetBoardById(id);
        if (board == null)
        {
            return NotFound();
        }
        return Ok(board);
    }

    // POST: api/Kanban/boards
    [HttpPost("boards")]
    public ActionResult<Board> AddBoard(Board board)
    {
        _kanbanService.AddBoard(board);
        return CreatedAtAction(nameof(GetBoard), new { id = board.Id }, board);
    }

    // PUT: api/Kanban/boards/{id}
    [HttpPut("boards/{id}")]
    public IActionResult UpdateBoard(Guid id, Board board)
    {
        if (id != board.Id)
        {
            return BadRequest();
        }

        var existingBoard = _kanbanService.GetBoardById(id);
        if (existingBoard == null)
        {
            return NotFound();
        }

        _kanbanService.UpdateBoard(board);
        return NoContent();
    }

    // DELETE: api/Kanban/boards/{id}
    [HttpDelete("boards/{id}")]
    public IActionResult DeleteBoard(Guid id)
    {
        var board = _kanbanService.GetBoardById(id);
        if (board == null)
        {
            return NotFound();
        }

        _kanbanService.DeleteBoard(id);
        return NoContent();
    }

    // GET: api/Kanban/missions
    [HttpGet("missions")]
    public ActionResult<IEnumerable<Mission>> GetMissions()
    {
        var missions = _kanbanService.GetMissions();
        return Ok(missions);
    }

    // GET: api/Kanban/missions/{id}
    [HttpGet("missions/{id}")]
    public ActionResult<Mission> GetMission(Guid id)
    {
        var mission = _kanbanService.GetMissionById(id);
        if (mission == null)
        {
            return NotFound();
        }
        return Ok(mission);
    }

    // POST: api/Kanban/missions
    [HttpPost("missions")]
    public ActionResult<Mission> AddMission(Mission mission)
    {
        _kanbanService.AddMission(mission);
        return CreatedAtAction(nameof(GetMission), new { id = mission.Id }, mission);
    }

    // PUT: api/Kanban/missions/{id}
    [HttpPut("missions/{id}")]
    public IActionResult UpdateMission(Guid id, Mission mission)
    {
        if (id != mission.Id)
        {
            return BadRequest();
        }

        var existingMission = _kanbanService.GetMissionById(id);
        if (existingMission == null)
        {
            return NotFound();
        }

        _kanbanService.UpdateMission(mission);
        return NoContent();
    }

    // DELETE: api/Kanban/missions/{id}
    [HttpDelete("missions/{id}")]
    public IActionResult DeleteMission(Guid id)
    {
        var mission = _kanbanService.GetMissionById(id);
        if (mission == null)
        {
            return NotFound();
        }

        _kanbanService.DeleteMission(id);
        return NoContent();
    }
}
