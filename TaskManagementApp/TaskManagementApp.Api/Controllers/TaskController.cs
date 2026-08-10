using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagementApp.Api.Dtos;
using TaskManagementApp.Api.Services;

namespace TaskManagementApp.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TaskController(ITaskService taskService) : ControllerBase
{
    // GET: api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetAllTasks()
    {
        var (userId, userRole) = GetUserClaims();
        var tasks = await taskService.GetAllTasksAsync(userId, userRole);
        return Ok(tasks);
    }
    
    // GET: api/tasks/{id}
    [HttpGet("{taskId:guid}")]
    public async Task<ActionResult<TaskResponseDto>> GetTaskById(Guid taskId)
    {
        var (userId, userRole) = GetUserClaims();
        var task = await taskService.GetTaskByIdAsync(taskId, userId, userRole);
        
        if (task == null) return NotFound(new { message = "Task not found or unauthorized." });
        return Ok(task);
    }
    
    // POST: api/tasks
    [HttpGet]
    public async Task<ActionResult<TaskResponseDto>> CreateTask([FromBody] CreateTaskDto dto)
    {
        var (userId, _) = GetUserClaims();
        var createdTask = await taskService.CreateTaskAsync(dto, userId);
        
        return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.Id }, createdTask);
    }
    
    // PUT: api/tasks/{id}
    [HttpPut("{taskId:guid}")]
    public async Task<ActionResult<TaskResponseDto>> UpdateTask(Guid taskId, [FromBody] UpdateTaskDto dto)
    {
        var (userId, userRole) = GetUserClaims();
        var updatedTask = await taskService.UpdateTaskAsync(taskId, dto, userId);
        
        if (updatedTask == null) return NotFound(new { message = "Task not found or unauthorized." });
        
        return Ok(updatedTask);
    }
    
    // DELETE: api/tasks/{id}
    [HttpDelete("{taskId:guid}")]
    public async Task<IActionResult> DeleteTask(Guid taskId)
    {
        var (userId, userRole) = GetUserClaims();
        var success = await taskService.DeleteTaskAsync(taskId, userId, userRole);
        
        if (!success) return NotFound(new { message = "Task not found or unauthorized." });
        
        return NoContent();
    }
    
    // Helper method to safety extract use claims from JWT token
    private (Guid UserId, string Role) GetUserClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            throw new UnauthorizedAccessException("Invalid token claims.");
        }
        
        return (parsedUserId, roleClaim);
    }
}