namespace Muse.Api.Models;

public enum PlaylistSource
{
    UserCreated,
    Spotify,
    YouTube,
    Generated
}

public class Playlist
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsPublic { get; set; }
    public PlaylistSource Source { get; set; }

    public Guid? CreatorId { get; set; }   // nullable: auto-generated playlists have no user creator
    public User? Creator { get; set; }

    public Guid MovieId { get; set; }
    public Movie Movie { get; set; } = null!;

    public List<Song> Songs { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}