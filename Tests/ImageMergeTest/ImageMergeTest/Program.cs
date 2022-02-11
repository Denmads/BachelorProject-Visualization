using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageMergeTest
{
    class Program
    {
        static void Main(string[] args)
        {
            Image small = Load();
            int cols = 8;
            int rows = 8;
            Bitmap mergedImg = new Bitmap(small.Width*cols, small.Height*rows);
            using(var g = Graphics.FromImage(mergedImg))
            {
                for (int y = 0; y < rows; y++)
                {
                    for (int x = 0; x < cols; x++)
                    {
                        g.DrawImage(small, small.Width * x, small.Height * y);
                    }
                }
            }

            mergedImg.Save("merged.jpg", ImageFormat.Jpeg);
        }

        static Image Load()
        {
            return Image.FromFile("C:\\Users\\Denmads\\Desktop\\test\\terminator small.jpg");
        }
    }
}
