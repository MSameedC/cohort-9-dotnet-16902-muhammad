using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagementApp.Api.Controllers;

[Authorize] // <--- This blocks unauthenticated users
[ApiController]
[Route("api/protected")]
public class ProtectedController : ControllerBase
{
    [HttpGet("test")]
    public IActionResult GetSecretData()
    {
        return Ok(new { message = "Success! You accessed a protected route using your JWT token." });
    }
}