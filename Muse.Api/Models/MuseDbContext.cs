using Microsoft.EntityFrameworkCore;

namespace Muse.Api.Models;

public class MuseDbContext : DbContext
{
    public MuseDbContext(DbContextOptions<MuseDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Playlist> Playlists => Set<Playlist>();
    public DbSet<SavedPlaylist> SavedPlaylists => Set<SavedPlaylist>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
        });

        modelBuilder.Entity<Playlist>(e =>
        {
            // songs stored as a JSON column — no separate Song table
            e.OwnsMany(p => p.Songs, sb => sb.ToJson());

            e.HasOne(p => p.Movie)
                .WithMany(m => m.Playlists)
                .HasForeignKey(p => p.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(p => p.Creator)
                .WithMany(u => u.CreatedPlaylists)
                .HasForeignKey(p => p.CreatorId)
                .OnDelete(DeleteBehavior.SetNull); // deleting a user shouldn't delete the playlist
        });

        modelBuilder.Entity<SavedPlaylist>(e =>
        {
            e.HasOne(sp => sp.User)
                .WithMany(u => u.SavedPlaylists)
                .HasForeignKey(sp => sp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(sp => sp.Playlist)
                .WithMany()
                .HasForeignKey(sp => sp.PlaylistId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(sp => new { sp.UserId, sp.PlaylistId }).IsUnique(); // can't save the same playlist twice
        });
    }
}
