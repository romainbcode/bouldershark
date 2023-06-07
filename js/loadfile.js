import { Carte } from "./carte.js";
const jouer = document.getElementById("jouer");
const niveau1 = document.getElementById("niveau1");
const niveau2 = document.getElementById("niveau2");
const niveau3 = document.getElementById("niveau3");
const reprendreniveau = document.getElementById('reprendreGame');

//Fonction permettant de charger un fichier.txt 
function loadFile(filePath){
    var result =null;
    var xmlhttp = new
    XMLHttpRequest();
    xmlhttp.open("GET", filePath,false);
    xmlhttp.send();
    if(xmlhttp.status==200){
        result= xmlhttp.responseText;
    }
    const lines = result;
    const carte = new Carte(lines); 
}

//Gère les événements lorsque l'on clique sur le bouton Reprendre une partie
reprendreniveau.addEventListener('click', function(){
    var a = localStorage.getItem('nbrediamants');
    var b = localStorage.getItem('totalDiams');
    var c = localStorage.getItem('Status_vie');

   //Vérifie que la partie précédente était déjà gagné ou non
    if(a==b){
        alert("La partie précédente a déja gagné");
    }
    else if (c == "false"){
        alert("La partie précédente était perdue");
    }
    else if(a != b){
        backmenu.style.display="flex";
        //Reprend la dernière partie
        const carte = new Carte(localStorage.getItem('map'),localStorage.getItem('nbrediamants'), localStorage.getItem('nbredeplacement'),true);
    }
})

//Gère les événements quand on clique sur le bouton jouer. Il propose alors 3 niveaux de jeu
jouer.addEventListener('click', function(){
    boutonNiveaux.style.display="flex";
    backmenu.style.display="flex";
    importfile.style.display="none";
})

//Lance le niveau 1 quand on clique sur ce bouton
niveau1.addEventListener("click",function(){
    
    boutonNiveaux.style.display ="none";
    //charge le fichier correspond au niveau1
    loadFile("./fichierTexte/niveau1.txt");
})


niveau2.addEventListener("click",function(){
    boutonNiveaux.style.display ="none";
    loadFile("./fichierTexte/niveau2.txt");
})


niveau3.addEventListener("click",function(){
    boutonNiveaux.style.display ="none";
    loadFile("./fichierTexte/niveau3.txt");
})