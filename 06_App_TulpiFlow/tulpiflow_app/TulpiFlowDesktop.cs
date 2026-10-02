using System;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Diagnostics;
using System.Reflection;
using System.Threading;
using System.Collections.Generic;

namespace TulpiFlow
{
    static class Program
    {
        private static HttpListener _listener;
        private static string _appDir;
        private static bool _running = true;

        [STAThread]
        static void Main()
        {
            try
            {
                // 1. Prepare Local App Data Directory
                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string tulpiRoot = Path.Combine(localAppData, "TulpiFlow");
                _appDir = Path.Combine(tulpiRoot, "assets_v200");

                if (!Directory.Exists(_appDir))
                {
                    Directory.CreateDirectory(_appDir);
                }

                // 2. Extract Embedded Assets if not already present or updated
                ExtractEmbeddedAssets(_appDir);

                // 3. Find an available localhost port
                int port = GetAvailablePort();

                // 4. Start Local High-Speed HTTP Server
                _listener = new HttpListener();
                _listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
                _listener.Start();

                Thread serverThread = new Thread(ServerLoop)
                {
                    IsBackground = true
                };
                serverThread.Start();

                // 5. Locate Edge or Chrome Executable
                string browserPath = FindBrowserExecutable();
                if (string.IsNullOrEmpty(browserPath))
                {
                    Process.Start("http://127.0.0.1:" + port + "/index.html");
                    return;
                }

                // 6. Launch in Standalone App Window Mode
                string profileDir = Path.Combine(tulpiRoot, "Profile");
                string appUrl = "http://127.0.0.1:" + port + "/index.html";
                string arguments = string.Format(
                    "--app=\"{0}\" --user-data-dir=\"{1}\" --window-size=1280,840 --class=TulpiFlow --enable-features=OverlayScrollbar",
                    appUrl, profileDir
                );

                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = browserPath,
                    Arguments = arguments,
                    UseShellExecute = false
                };

                Process browserProc = Process.Start(psi);
                if (browserProc != null)
                {
                    browserProc.WaitForExit();
                }

                _running = false;
                _listener.Stop();
            }
            catch (Exception ex)
            {
                File.WriteAllText(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), "tulpiflow_error.log"), ex.ToString());
            }
        }

        private static void ExtractEmbeddedAssets(string targetDir)
        {
            Assembly assembly = Assembly.GetExecutingAssembly();
            using (Stream resourceStream = assembly.GetManifestResourceStream("TulpiFlow.assets.zip"))
            {
                if (resourceStream == null)
                {
                    // Fallback: copy from adjacent www folder if available
                    string localWww = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "www");
                    if (Directory.Exists(localWww))
                    {
                        CopyDirectory(localWww, targetDir);
                    }
                    return;
                }

                string zipPath = Path.Combine(targetDir, "assets.zip");
                using (FileStream fs = new FileStream(zipPath, FileMode.Create, FileAccess.Write))
                {
                    resourceStream.CopyTo(fs);
                }

                using (ZipArchive archive = ZipFile.OpenRead(zipPath))
                {
                    foreach (ZipArchiveEntry entry in archive.Entries)
                    {
                        string destinationPath = Path.Combine(targetDir, entry.FullName);
                        string dir = Path.GetDirectoryName(destinationPath);
                        if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                        {
                            Directory.CreateDirectory(dir);
                        }
                        if (!string.IsNullOrEmpty(entry.Name))
                        {
                            entry.ExtractToFile(destinationPath, true);
                        }
                    }
                }

                try { File.Delete(zipPath); } catch { }
            }
        }

        private static void CopyDirectory(string sourceDir, string targetDir)
        {
            foreach (string dir in Directory.GetDirectories(sourceDir, "*", SearchOption.AllDirectories))
            {
                Directory.CreateDirectory(dir.Replace(sourceDir, targetDir));
            }
            foreach (string file in Directory.GetFiles(sourceDir, "*.*", SearchOption.AllDirectories))
            {
                File.Copy(file, file.Replace(sourceDir, targetDir), true);
            }
        }

        private static int GetAvailablePort()
        {
            System.Net.Sockets.TcpListener l = new System.Net.Sockets.TcpListener(IPAddress.Loopback, 0);
            l.Start();
            int port = ((IPEndPoint)l.LocalEndpoint).Port;
            l.Stop();
            return port;
        }

        private static string FindBrowserExecutable()
        {
            string[] paths = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
            };

            foreach (string p in paths)
            {
                if (File.Exists(p)) return p;
            }
            return null;
        }

        private static void ServerLoop()
        {
            while (_running && _listener.IsListening)
            {
                try
                {
                    HttpListenerContext context = _listener.GetContext();
                    ThreadPool.QueueUserWorkItem(ProcessRequest, context);
                }
                catch
                {
                    if (!_running) break;
                }
            }
        }

        private static void ProcessRequest(object state)
        {
            HttpListenerContext context = (HttpListenerContext)state;
            try
            {
                string rawUrl = context.Request.Url.AbsolutePath.TrimStart('/');
                if (string.IsNullOrEmpty(rawUrl)) rawUrl = "index.html";

                string filePath = Path.Combine(_appDir, rawUrl.Replace('/', Path.DirectorySeparatorChar));

                if (File.Exists(filePath))
                {
                    byte[] bytes = File.ReadAllBytes(filePath);
                    context.Response.ContentType = GetMimeType(filePath);
                    context.Response.ContentLength64 = bytes.Length;
                    context.Response.AddHeader("Cache-Control", "no-cache");
                    context.Response.OutputStream.Write(bytes, 0, bytes.Length);
                }
                else
                {
                    context.Response.StatusCode = 404;
                }
            }
            catch
            {
                context.Response.StatusCode = 500;
            }
            finally
            {
                try { context.Response.OutputStream.Close(); } catch { }
            }
        }

        private static string GetMimeType(string path)
        {
            string ext = Path.GetExtension(path).ToLowerInvariant();
            switch (ext)
            {
                case ".html": return "text/html; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".png": return "image/png";
                case ".svg": return "image/svg+xml";
                case ".ico": return "image/x-icon";
                case ".wav": return "audio/wav";
                default: return "application/octet-stream";
            }
        }
    }
}
