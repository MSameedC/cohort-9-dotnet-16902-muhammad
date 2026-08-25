using TaskManagementApp.Api.Enums;

namespace TaskManagementApp.Api.Models;

public class TaskItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Status Status { get; set; } = Status.None;
    public Priority Priority { get; set; } = Priority.Normal;
    public DateTime? DueDate { get; set; }

    // Foreign Key linking to user
    public Guid UserId { get; set; }

    // Navigation property (A task belongs to one user)
    public User User { get; set; } = null!;
}

// -------------------