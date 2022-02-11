let dataTxt = document.querySelector("#bufferData");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let txt = document.querySelector("#txt");

let correct = "/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoAEgDASIAAhEBAxEB/8QAHAAAAgMAAwEAAAAAAAAAAAAAAAUDBAYCBwgB/8QAMBAAAgEDAwMCBAUFAQAAAAAAAQIDBAURABIhBhMxQVEUImGBB0JxkbEjJDJDwWL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AuWv5qqXaSoDkLk5OM4BOef31t6ZS3y5zxnWTskYNa28AAsQBjzrWQSKoDEkYBBB86COvpRJGGTduTkBeM8az92uVTQ9Q2OzwJR1ENSMzqQXnTLALwGG0bQzbjnOPGtQ8vdQquFJHBPgHXnCvjuti6ovFRca+Bb9TSGSQIrSd4kbyysowqgbTk49B6HQegTDC29wBtGR8vrqMLGQCvj048ahdg9MoB4ODhfYnXMU7lFVc+MAgc/YaDhEO2u4kYzzzqrKxYjjg+v21Qs3U1Ld77WWeGinNTRtIHmR1kiIVtoPo2Tn2xnPOuNTeJI+sFsQtszL2O81V3AFTKkj5ceMjbnPkjjQTyhd65X/Yv340annUb03DGJRn9caNBZssFWktwjuUkMk0NSYVkjTbvUKrK7DP+RDjOMcjxqzUP26qWQHlQQBnyMeNLqS9W6n+J/uMzPK00rspG9z5OPQcAAewGkd26hoZJzGa3YuDwYycnHHj66DRx1tUyRExKpdudp3EAft9Bx66XtRWipvF0uJieCtqqp6SWoZwwVYoQXAB4XcVAJ/jSWi6htgEcHx8QkfD1Dtkc+gz9vHsOdYW4vU0V/paCa6NJbDhx25iIXZySxOcZzjke4H00Hd9vo0jpIVhLNTmOMoGO44xxyf+6zn4jdUyWG3QUVtyLlVqWDkcwRDILj/0TwPbBPoNXoOorTDDtpK+mMMS4Ve5j5RwAAftrNX+jtnUdHfKx+2bjHWxQw1iy5angVIgx2g/Oo3OdvvoJ/wz6TpI+nJay529N9Y+YTKuZFjEe3eD+XcSSPfAOlN2mi6WukVtsk81zjQPG9ugpz8RC5ZX7jsoAc8+cD0H112dRVNtpYKSko50eKKFY427gJKBQAT+vnWSqqGnuXW95W518sFQKaF6N6dkjzE25VYNyxKNnK+D68YGgZR1KVsEc6LLGe923ilTZJE4xuR1/KwyOPqD4OjXXn4eC6Ut06gjrJt1ItasUpeo3P8AEqfI9SCg5P6aNAoruoAGYNDICT6SA/8ANLp79v8AiFaOWIFMAArkj65/jxo0aCqt3poajvCGaNWVVbLKzZHgnn203lvVvqbbLBWNVvFIN204H34bRo0FZrjSJRyQ0ctQflwmwH9wRprb5bBDbGinUSSLyXeGTLHyTkDOfOjRoPsdZaP6bKsaxg8ZgIDe/wCXjU87UUq1DUNUIIowDIQNpI3cfPt3cH0HHjjRo0CK4V0ETyyGsjqJJNgaRsdwBc4GRgcZ8EffRo0aD//Z"

function fetchAll() {
  let ids = ["tt0000048", "tt0000052"];
    let numCorrect = 0;
    let numReturned = 0;
  
    for (let i = 0; i < 100; i++) {
      let body = {
        data: [
            {
                imgId: "img",
                images: [ids[i % 2]]
            }
        ]
    }
      fetch("http://localhost:8080/picture/lowres", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
      })
      .then(data => data.json())
      .then(json => {
        numReturned++;
        console.log("ID: ", Object.keys(json["img"].info)[0]);
        console.log(json["img"].buffer);
        if (Object.keys(json["img"].info).includes("tt0000048")) {
          
          if (json["img"].buffer == correct) {
            numCorrect++;
            txt.textContent = numCorrect + " / 50 correct && " + numReturned + " / 100";
          }
        }
      });
    }
}

function draw() {
    let blob = b64toBlob(dataTxt.value);
    let img = new Image();
    img.onload = e => {
        canvas.width = img.width
        canvas.height = img.height
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
    }
    img.src = URL.createObjectURL(blob);
}

function b64toBlob(b64Data, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}