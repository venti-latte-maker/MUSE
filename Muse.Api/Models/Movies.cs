namespace Muse.Api.Models;

public class Movie
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public int Year { get; set; }
    public string? PosterUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
}