using System.ComponentModel.DataAnnotations;
using TaskManagementApp.Api.Enums;

namespace TaskManagementApp.Api.Dtos;

public class CreateTaskDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = String.Empty;
    public string? Description { get; set; } = String.Empty;
    
    public Priority Priority { get; set; } = Priority.Normal;
    
    public DateTime? DueDate { get; set; }
}