using Microsoft.AspNetCore.Mvc;

namespace Muse.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AppController : ControllerBase
{
   [HttpGet]
   public ActionResult<string> Get()
   {
      return Ok("Hello World");
   }
}