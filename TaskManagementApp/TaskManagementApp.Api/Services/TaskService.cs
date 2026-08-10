using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Data;
using TaskManagementApp.Api.Dtos;
using TaskManagementApp.Api.Enums;
using TaskManagementApp.Api.Models;

namespace TaskManagementApp.Api.Services;

public class TaskService(ApplicationDbContext context) : ITaskService
{
    public async Task<IEnumerable<TaskResponseDto>> GetAllTasksAsync(Guid userId, string userRole)
    {
        IQueryable<TaskItem> query = context.Tasks;
        
        // If not an admin, restrict tasks to only the logged-in user
        if (userRole != "Admin")
        {
            query = query.Where(x => x.UserId == userId);
        }
        
        return await query.Select(t => new TaskResponseDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            Priority = t.Priority,
            DueDate =  t.DueDate,
            UserId = t.UserId
        }).ToListAsync();
    }

    public async Task<TaskResponseDto?> GetTaskByIdAsync(Guid taskId, Guid userId, string userRole)
    {
        var task = await context.Tasks.FindAsync(taskId);
        if (task == null) return null;
        
        // Check ownership if not admin
        if (userRole != "Admin" && task.UserId != userId) return null;

        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            DueDate = task.DueDate,
            UserId = task.UserId
        };
    }

    public async Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto, Guid userId)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            Status = Status.Pending,
            UserId = userId
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            DueDate = task.DueDate,
            UserId = task.UserId
        };
    }

    public async Task<TaskResponseDto?> UpdateTaskAsync(Guid taskId, UpdateTaskDto dto, Guid userId)
    {
        var task = await context.Tasks.FindAsync(taskId);
        if (task == null) return null;

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = dto.Status;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;

        await context.SaveChangesAsync();

        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            DueDate = task.DueDate,
            UserId = task.UserId
        };
    }

    public async Task<bool> DeleteTaskAsync(Guid taskId, Guid userId, string userRole)
    {
        var task = await context.Tasks.FindAsync(taskId);
        if (task == null) return false;

        // Check ownership if not admin
        if (userRole != "Admin" && task.UserId != userId) return false;

        context.Tasks.Remove(task);
        await context.SaveChangesAsync();
        return true;
    }
}