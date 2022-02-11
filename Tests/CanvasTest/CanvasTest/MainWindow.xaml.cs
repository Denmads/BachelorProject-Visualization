using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CanvasTest
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        DrawingGroup group;
        ImageDrawing imgD;
        public MainWindow()
        {
            InitializeComponent();

            group = new DrawingGroup();
            Random rnd = new Random();
            for (int y = 0; y < 100; y++)
            {
                for (int x = 0; x < 100; x++)
                {
                    int imgInd = rnd.Next(0, 9);
                    ImageDrawing gd = new ImageDrawing(new BitmapImage(new Uri("D:\\Software_engineering\\6.semester-Bachelor\\Bachelor\\images\\out" + imgInd + ".jpg")), new Rect(x * 16, y * 6, 15, 15));
                    if (y == 99 && x == 99)
                    {
                        imgD = gd;
                    }

                    group.Children.Add(gd);
                }
            }
            VHost host = new VHost();
            host.Visibility = Visibility.Visible;
            DrawingVisual vis = new DrawingVisual();
            DrawingContext dc = vis.RenderOpen();
            dc.DrawDrawing(group);
            dc.Close();
            host.Visual = vis;
            Canvas.Children.Add(host);
            Canvas.SetLeft(host, 0);
            Canvas.SetTop(host, 0);
        }

        System.Windows.Point last;
        private void Canvas_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            last = e.GetPosition(Canvas);
            Canvas.CaptureMouse();
        }

        private void Canvas_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            Canvas.ReleaseMouseCapture();
        }

        private void Canvas_MouseMove(object sender, MouseEventArgs e)
        {
            if (!Canvas.IsMouseCaptured)
                return;
            Vector v = last - e.GetPosition(Canvas);
            foreach (UIElement el in Canvas.Children)
            {
                Canvas.SetLeft(el, Canvas.GetLeft(el) - v.X);
                Canvas.SetTop(el, Canvas.GetTop(el) - v.Y);
            }
            last = e.GetPosition(Canvas);
        }

        private void Canvas_MouseRightButtonDown(object sender, MouseButtonEventArgs e)
        {
            imgD.Rect.Offset(new Vector(10, 0));
        }
    }
}
