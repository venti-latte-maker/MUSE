using Muse.Api.Models;

public class SavedPlaylist
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid PlaylistId { get; set; }
    public Playlist Playlist { get; set; } = null!;
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}