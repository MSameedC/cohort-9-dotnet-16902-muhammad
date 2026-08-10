using System.ComponentModel.DataAnnotations;
using TaskManagementApp.Api.Enums;

namespace TaskManagementApp.Api.Dtos;

public class UpdateTaskDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = String.Empty;
    public string? Description { get; set; } = String.Empty;
    
    public Status Status { get; set; } = Status.None;
    public Priority Priority { get; set; } = Priority.Low;
    
    public DateTime? DueDate { get; set; }
}