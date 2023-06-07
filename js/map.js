import { Carte } from "./carte.js";
const input = document.querySelector('input[type="file"]')

//Lorsque l'on clique sur le bouton Choisir le fichier, on récupère alors le fichier .txt que l'on transforme alors en tableau
input.addEventListener('change', function (e) {
    backmenu.style.display="flex";
    const reader = new FileReader() 
    reader.onload = function(){
        const lines = reader.result
        const carte = new Carte(lines)        
     }
    reader.readAsText(input.files[0]);
},false);

 