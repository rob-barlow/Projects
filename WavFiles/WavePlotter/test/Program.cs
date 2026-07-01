static string FindSolutionPath()
{
    var dir = new DirectoryInfo(Directory.GetCurrentDirectory());

    while (dir != null && dir.Name != "test")
        dir = dir.Parent;

    return dir?.Parent?.FullName ?? "";
}

string solutionPath = FindSolutionPath();

byte[] headerBytes = File.ReadAllBytes(solutionPath + "\\sample-3s.wav").Take(48).ToArray();

string[] headerHexArray = headerBytes.Select(headerByte => headerByte.ToString("X2")).ToArray();

string headerHex = string.Join(string.Empty, headerHexArray);

Console.WriteLine(headerHex);