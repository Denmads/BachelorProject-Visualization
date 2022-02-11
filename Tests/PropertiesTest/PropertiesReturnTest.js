function getProperties(){
    fetch("http://localhost:8080/filteredTitles",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        //Empty to test the return of all properties
        body: JSON.stringify({})
    }).then(res => res.json())
    .then(res => {
        console.log("res",res)
    })
}