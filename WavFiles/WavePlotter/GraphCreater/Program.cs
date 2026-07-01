using System.Globalization;

static string FindSolutionPath()
{
    var dir = new DirectoryInfo(Directory.GetCurrentDirectory());

    while (dir != null && dir.Name != "GraphCreater")
        dir = dir.Parent;

    return dir?.Parent?.FullName ?? "";
}


string outputPath = FindSolutionPath() + "\\outputhex.txt";

string outputHex = File.ReadAllText(outputPath)
    .Substring(0,10000)
    .ReplaceLineEndings(string.Empty)
    .Replace(" ", string.Empty);

List<Int16> data = [];

for (int i = 0; i < outputHex.Count(); i += 4)
{
    Int16 num = Int16.Parse(outputHex[i..(i + 4)], NumberStyles.HexNumber, CultureInfo.InvariantCulture);
    data.Add(num);
}

var plt = new ScottPlot.Plot();
plt.Add.Signal(data);

string imagePath = FindSolutionPath() + "\\wave.png";
plt.SavePng(imagePath, 800, 600);

Console.WriteLine("Saved");