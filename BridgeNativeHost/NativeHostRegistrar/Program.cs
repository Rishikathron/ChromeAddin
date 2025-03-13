using System;
using System.Diagnostics;

namespace NativeHostRegistrar
{
    class Program
    {
        static int Main(string[] args)
        {
            // Build the command to register the native messaging host manifest.
            // REG ADD to create a key under HKCU.
            // Note: The command uses an absolute path. Use %LOCALAPPDATA% if needed.
            // Example command:
            // REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.example.bridge" /ve /t REG_SZ /d "C:\Users\YourUsername\AppData\Local\Google\Chrome\User Data\NativeMessagingHosts\com.example.bridge.json" /f

            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string manifestPath = $"{localAppData}\\Google\\Chrome\\User Data\\NativeMessagingHosts\\com.example.bridge.json";

            string regCommand = $"REG ADD \"HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\com.example.bridge\" /ve /t REG_SZ /d \"{manifestPath}\" /f";

            try
            {
                Console.Error.WriteLine("Executing command: " + regCommand);

                ProcessStartInfo psi = new ProcessStartInfo("cmd.exe", "/c " + regCommand)
                {
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };

                // Start the process and wait for it to complete.
                using (Process process = Process.Start(psi))
                {
                    process.WaitForExit();

                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();

                    Console.Error.WriteLine("Command Output: " + output);
                    if (!string.IsNullOrEmpty(error))
                    {
                        Console.Error.WriteLine("Command Error: " + error);
                    }
                    Console.WriteLine("Press any key to exit...");
                    Console.ReadKey();
                    return process.ExitCode;
                }
                
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("Exception: " + ex.Message);
                return -1;
            }
        }
    }
}
