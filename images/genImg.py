import numpy
import math
import random
from PIL import Image

imgW = 256
imgH = 256

def fillRect(arr, x, y, w, h):
    r = random.random() * 256
    g = random.random() * 256
    b = random.random() * 256
    for yPos in range(y, y+h):
        for xPos in range(x, x+w):
            arr[xPos][yPos][0] = r
            arr[xPos][yPos][1] = g
            arr[xPos][yPos][2] = b

for n in range(10):
    a = numpy.random.rand(imgW, imgH, 3) * 0
    for i in range(5):
        x = math.floor(random.random() * imgW)
        y = math.floor(random.random() * imgH)
        w = min(math.floor(random.random() * imgW/2), imgW-x)
        h = min(math.floor(random.random() * imgH/2), imgH-y)
        fillRect(a, x, y, w, h)


    im_out = Image.fromarray(a.astype('uint8')).convert('RGB')
    im_out.save('out%000d.jpg' % n)