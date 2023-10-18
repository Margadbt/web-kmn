const mbti = document.getElementById("mbti")
const temprament = document.getElementById("temprament")
const enne = document.getElementById("enne")

mbti.addEventListener("click", function(){
    const tempTitle = document.getElementsByClassName("tempTitle");
    const mbtiTitle = document.getElementsByClassName("mbtiTitle");
    const enneTitle = document.getElementsByClassName("enneTitle");
    tempTitle[0].className = tempTitle[0].className + " ina"
    enneTitle[0].className = enneTitle[0].className + " ina"
    mbtiTitle[0].classList.remove("ina")

    mbti.className = "active"
    temprament.classList.remove("active"); 
    enne.classList.remove("active")
})
temprament.addEventListener("click", function(){
    const mbtiTitle = document.getElementsByClassName("mbtiTitle");
    const tempTitle = document.getElementsByClassName("tempTitle");
    const enneTitle = document.getElementsByClassName("enneTitle");
    
    enneTitle[0].className = enneTitle[0].className + " ina"
    mbtiTitle[0].className = mbtiTitle[0].className + " ina"
    tempTitle[0].classList.remove("ina")

    temprament.className = "active"
    mbti.classList.remove("active"); 
    enne.classList.remove("active");
})
enne.addEventListener("click", function(){
    const mbtiTitle = document.getElementsByClassName("mbtiTitle");
    const tempTitle = document.getElementsByClassName("tempTitle");
    const enneTitle = document.getElementsByClassName("enneTitle")
    tempTitle[0].className = tempTitle[0].className + " ina"
    mbtiTitle[0].className = mbtiTitle[0].className + " ina"
    enneTitle[0].classList.remove("ina")

    temprament.classList.remove("active"); 
    mbti.classList.remove("active"); 
    enne.className = enne.className + " active"
})