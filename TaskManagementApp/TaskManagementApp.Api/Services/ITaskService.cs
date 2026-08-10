using TaskManagementApp.Api.Dtos;

namespace TaskManagementApp.Api.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskResponseDto>> GetAllTasksAsync(Guid userId, string userRole);
    Task<TaskResponseDto?> GetTaskByIdAsync(Guid taskId, Guid userId, string userRole);
    Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto createTaskDto, Guid userId);
    Task<TaskResponseDto?> UpdateTaskAsync(Guid taskId, UpdateTaskDto updateTaskDto, Guid userId);
    Task<bool> DeleteTaskAsync(Guid taskId, Guid userId, string userRole);
}