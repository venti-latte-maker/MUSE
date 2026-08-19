# MUSE : Movies Songs Understanding, Search and Extraction
MUSE is a tool created to extract music from your favorite movie, collect the YouTube links and group them in a playlist for convenience.
Additionally, we provide personalized recommendations by looking at the music and movies you are interested in.

## Database Design
<img width="557" height="1204" alt="Database Schema" src="https://github.com/user-attachments/assets/1d3f1151-87aa-40bc-b099-9fbea2fef631" />

## User Flow
<img width="722" height="1282" alt="User Flow Structure" src="https://github.com/user-attachments/assets/4aa85f53-84b6-468c-8d1a-cbb779baffba" />

## Setup Instruction
### Setting up Database
1. Make sure `dotnet ef` is installed  
```shell
dotnet tool install --global dotnet-ef
```
2. To update the database  
```shell
dotnet ef database update
```

### Database URL String
Make sure you run the following commands  
```shell
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=MuseDb;User Id=sa;Password=<yout_password_here>;TrustServerCertificate=True;"
```
**Note** : Make sure to change the username and password in the above connection string.  