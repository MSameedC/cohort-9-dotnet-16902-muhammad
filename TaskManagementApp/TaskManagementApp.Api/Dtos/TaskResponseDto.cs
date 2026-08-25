using TaskManagementApp.Api.Enums;

namespace TaskManagementApp.Api.Dtos;

public class TaskResponseDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Status Status { get; set; } = Status.None;
    public Priority Priority { get; set; } = Priority.Normal;

    public DateTime? DueDate { get; set; }

    public Guid UserId { get; set; }
}