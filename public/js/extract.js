


let banner= document.getElementById("mainBanner");
let navbar = document.getElementById("navbar");



 observer = new IntersectionObserver(function(entries) {
    console.log(entries)
   
    if(entries[0].intersectionRatio === 0 ){
       navbar.style.backgroundColor="#ffffff"
        
    }
    if(entries[0].intersectionRatio !== 0){
        
        navbar.style.backgroundColor="#ffc017";
        navbar.style.color="#000000"
        
    }
});

observer.observe(banner);