using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BridgeNativeHost
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                string url = string.Empty;
                // Log to stderr if necessary
                //WriteMessage(JsonSerializer.Serialize(new { success = true, message = "Application started from extension" }));
                Console.Error.WriteLine("Application started from extension");

                Console.Error.WriteLine("..................................");
                    

                // Read the JSON message from standard input (native messaging protocol)
                string inputMessage = ReadMessage();
                WriteMessage(JsonSerializer.Serialize(new { success = true, message = "Reading message from stdin : ",inputMessage }));
                using (JsonDocument jsonDoc = JsonDocument.Parse(inputMessage))
                    {
                        if (jsonDoc.RootElement.TryGetProperty("url", out JsonElement urlElement))
                        {
                            url = urlElement.GetString();
                            WriteMessage(JsonSerializer.Serialize(new { success = false, error = "URL provided in JSON is -> ",url }));

                        }
                        else
                        {
                            WriteMessage(JsonSerializer.Serialize(new { success = false, error = "No URL provided in JSON." }));
                            return;
                        }
                    }
                

                if (string.IsNullOrWhiteSpace(url))
                {
                    WriteMessage(JsonSerializer.Serialize(new { success = false, error = "URL is empty." }));
                    return;
                }

                // Construct the command to launch the native application.
                string command = $"\"{url}\""; // Launch the executable directly.
                Console.Error.WriteLine("Launching command: " + command);
                WriteMessage($"Launching command : {command}");

                ProcessStartInfo psi = new ProcessStartInfo(url) // where 'url' is the EXE path
                {
                    CreateNoWindow = false, // Show the window
                    UseShellExecute = true  // Allows launching an EXE with its associated UI
                };
                Process process = Process.Start(psi);
                WriteMessage(JsonSerializer.Serialize(new { success = true, message = "Application launched successfully" }));
            }
            catch (Exception ex)
            {
                WriteMessage(JsonSerializer.Serialize(new { success = false, error = ex.Message }));
            }
        }

        /// <summary>
        /// Reads a native messaging message from standard input.
        /// The first 4 bytes (little-endian) denote the message length.
        /// </summary>
        static string ReadMessage()
        {
            Stream stdin = Console.OpenStandardInput();
            byte[] lengthBytes = new byte[4];
            int bytesRead = stdin.Read(lengthBytes, 0, 4);
            if (bytesRead == 0)
                Environment.Exit(0);
            int messageLength = BitConverter.ToInt32(lengthBytes, 0);
            byte[] buffer = new byte[messageLength];
            int totalBytesRead = 0;
            while (totalBytesRead < messageLength)
            {
                int read = stdin.Read(buffer, totalBytesRead, messageLength - totalBytesRead);
                if (read == 0)
                    break;
                totalBytesRead += read;
            }
            return Encoding.UTF8.GetString(buffer, 0, totalBytesRead);
        }

        /// <summary>
        /// Writes a native messaging message to standard output.
        /// It prefixes the JSON message with its length (4-byte little-endian).
        /// </summary>
        static void WriteMessage(string message)
        {
            byte[] messageBytes = Encoding.UTF8.GetBytes(message);
            int length = messageBytes.Length;
            byte[] lengthBytes = BitConverter.GetBytes(length);
            Stream stdout = Console.OpenStandardOutput();
            stdout.Write(lengthBytes, 0, lengthBytes.Length);
            stdout.Write(messageBytes, 0, messageBytes.Length);
            stdout.Flush();
        }
    }
}
