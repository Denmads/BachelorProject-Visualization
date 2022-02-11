function loadImage(){
    fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088247","tt0088248","tt0088249","tt0088250","tt0088252","tt0088253","tt0088254","tt0088255", "tt0088256"]}]})
        //body: JSON.stringify({data: [{imgId: "1", images: ["tt0000001","tt0000002","tt0000003","tt0000004","tt0000005","tt0000006","tt0000007","tt0000008", "tt0000009"]}]})
        //body: JSON.stringify({data: [{imgId: "1", images: ["tt0088251"]}]})
    }).then(res => res.json())
    .then(async res => {
        let canvas = document.createElement('canvas')
        canvas.id = "imageCanvas"
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        document.body.appendChild(canvas)
        let blob = b64toBlob(res[1].buffer)
        console.log(res[1].info)
        let img = new Image()
        canvas = document.getElementById("imageCanvas")
        let ctx = canvas.getContext("2d")
        img.onload = () => {
            ctx.drawImage(img, 0,0)
        }
        img.src = URL.createObjectURL(blob)
    })
}

async function loadAllImages(){
    let t0 = performance.now()
    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088247"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088248"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088249"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088250"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088252"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088253"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088254"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088255"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })

    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088256"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })
    let t1 = performance.now()
    console.log("Individual fetches time (ms)", t1-t0)

    t0 = performance.now()
    await fetch('http://localhost:8080/picture/lowres',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: [{imgId: "1", images: ["tt0088247","tt0088248","tt0088249","tt0088250","tt0088252","tt0088253","tt0088254","tt0088255", "tt0088256"]}]})
    }).then(res => res.json())
    .then(async res => {
        let blob = b64toBlob(res[1].buffer)
    })
    t1 = performance.now()
    console.log("Composited image time (ms)",t1-t0)
}





//https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
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