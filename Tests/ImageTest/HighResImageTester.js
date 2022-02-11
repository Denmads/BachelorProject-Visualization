function loadImage(){
    fetch('http://localhost:8080/picture/highres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({titleId: "tt0088247"})
    }).then(async res => {
        let canvas = document.createElement('canvas')
        canvas.id = "imageCanvas"
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        document.body.appendChild(canvas)
        let blob = await res.blob()
        let img = new Image()
        canvas = document.getElementById("imageCanvas")
        let ctx = canvas.getContext("2d")
        img.onload = () => {
            ctx.drawImage(img, 300, 300)
        }
        img.src = URL.createObjectURL(blob)
        
    })
}