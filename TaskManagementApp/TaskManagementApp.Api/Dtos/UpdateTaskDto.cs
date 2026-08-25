using System.ComponentModel.DataAnnotations;
using TaskManagementApp.Api.Enums;

namespace TaskManagementApp.Api.Dtos;

public class UpdateTaskDto
{
    [Required] [MaxLength(100)] public string Title { get; set; } = string.Empty;

    public string? Description { get; set; } = string.Empty;

    public Status Status { get; set; } = Status.Pending;
    public Priority Priority { get; set; } = Priority.Normal;

    [Required] public DateTime DueDate { get; set; }
}