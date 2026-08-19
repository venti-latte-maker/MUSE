namespace Muse.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Username { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Playlist> CreatedPlaylists { get; set; } = new List<Playlist>();
    public ICollection<SavedPlaylist> SavedPlaylists { get; set; } = new List<SavedPlaylist>();
}
