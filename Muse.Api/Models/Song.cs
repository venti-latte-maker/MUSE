namespace Muse.Api.Models;

// This is NOT a DB entity on its own — it's serialized as JSON inside Playlist.Songs
public class Song
{
    public required string Title { get; set; }
    public string? Artist { get; set; }
    public required string Url { get; set; }
}