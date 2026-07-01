using System.Data;

static string FindSolutionPath()
{
    var dir = new DirectoryInfo(Directory.GetCurrentDirectory());

    while (dir != null && dir.Name != "WavePlotter")
        dir = dir.Parent;

    return dir?.Parent?.FullName ?? "";
}

static string GetHeader()
{
    string solutionPath = FindSolutionPath();

    byte[] headerBytes = File.ReadAllBytes(solutionPath + "\\sample-3s.wav").Take(48).ToArray();

    string[] headerHexArray = headerBytes.Select(headerByte => headerByte.ToString("X2")).ToArray();

    return string.Join(string.Empty, headerHexArray);
}


static byte[] GetBytes(string hex)
{
    return Enumerable.Range(0, hex.Length / 2)
    .Select(i => Convert.ToByte(hex.Substring(i * 2, 2), 16))
    .ToArray();
}
static IEnumerable<int> GenerateNums(int interval = 1000)
{
    int num = -32500;
    var nums = new List<int>();
    interval = 62000 / 85;
    while (num <= 32500)
    {
        nums.Add(num);
        num += interval;
    }
    return nums;
}

static int TwosComplement(int num)
{
    UInt16 posNum = (UInt16)Math.Abs(num);
    if (num < 0)
    {
        posNum = (ushort)~posNum;
        posNum++;
    }

    return posNum;
}

static string[] NumsToHex(IEnumerable<int> nums)
{
    // Freq of C is 260Hz

    var hexList = nums.Select(x => TwosComplement(x).ToString("X4"));
    return [..hexList];
}

static string HexToPattern(string[] hexArray)
{
    var littleEndinan = hexArray.Select(h => h[2..4] + h[0..2]);
    return string.Join(string.Empty, hexArray);
}

static string PatternToBody(string pattern)
{
    string body = string.Empty;
    do
    {
        body += pattern;
    }
    while (body.Count() < 1100000);

    return body;
}

string header = GetHeader();

int interval = 500;

IEnumerable<int> nums = GenerateNums(interval);

string[] hexArray = NumsToHex(nums); 

string pattern = HexToPattern(hexArray);

string body = PatternToBody(pattern);

string fileContent = header + body;

string outputHexPath = FindSolutionPath() + "/outputhex.txt";

File.WriteAllText(outputHexPath, fileContent);

string outputBinPath = FindSolutionPath() + "/outputbin.wav";

byte[] bytes = GetBytes(fileContent);

File.WriteAllBytes(outputBinPath, bytes);

Console.WriteLine("Written");
