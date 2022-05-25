// const fixedDiv= document.getElementById("fixedDiv")
// console.log(fixedDiv)
// window.addEventListener('scroll', (event) => {
//     fixedDiv.backgroundColor= "grey";
//     alert("here we are");
// });
const fixedDiv= document.getElementById("fixedDiv")


let observer = new IntersectionObserver(function(entries) {
    console.log(entries)
   
    if(entries[0].isIntersecting===true){
       
        
        fixedDiv.className="fixedsection";
       
        
    }
    
});

observer.observe(fixedDiv);