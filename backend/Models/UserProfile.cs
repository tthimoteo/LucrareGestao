using System.Text.Json.Serialization;

namespace backend.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserProfile
    {
        Usuario = 0,
        Administrador = 1
    }
}