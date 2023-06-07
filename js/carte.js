export class Carte{

    #lines;
    #diamants;
    #deplacements;
    #restarts;
    #totalDiams;
    //constructeur de la classe Carte
    constructor(line, diamants=0, deplacement=0, restart = false){
        this.#restarts = restart;
        this.#diamants = parseInt(diamants);
        this.#deplacements = deplacement;
        this.#lines = line;
        this.Game(line);
        this.affichageNbreDiamsNbreDepl();
        this.calculDiams(restart);
    }

    //getter
    get diamstot() {return this.#totalDiams}
    get restarts() {return this.#restarts}
    get lines(){return this.#lines;}
    get diams(){return this.#diamants;}
    get deplacement(){return this.#deplacements;}    
 
    //setter
    set diamstot(totaldiam){this.#totalDiams = totaldiam }
    set lines(tableau){this.#lines = tableau;}
    set diams(nbrediams){this.#diamants = nbrediams;}
    set deplacement(nbredeplacement){this.#deplacements=nbredeplacement;}
    
 
    //affiche les infos sur les nageurs et sur le nombre de déplacements effectués
    affichageNbreDiamsNbreDepl(){
        const nbrediams = document.getElementById('infogamediams');
        const nbredeplacement = document.getElementById('infogamedeplacement');
        nbrediams.style.display = "flex";
        nbredeplacement.style.display ="flex";
    }

    //Calcul le nombre de diamants présent sur la carte
    calculDiams(restarts){
        //calcul les nombre de diamants sur la carte au lancement de la partie
        if(restarts == false){
        let nbrdiams = 0;
        for(let a=0; a<527; a++){
            if(this.lines[a]=="D"){
                nbrdiams ++; ;
            }
        }
        const diamsHTML = document.getElementById("diamstot");
        diamsHTML.innerHTML = nbrdiams;
        localStorage.setItem("totalDiams",nbrdiams);
        this.#totalDiams = nbrdiams;
    }
    //calcul le nombre de diamants sur la carte d'une parti en cours (en utilisant le bouton reprendre une partie)
    else if(restarts == true){
        let nbrdiams = localStorage.getItem("totalDiams");
        const diamsHTML = document.getElementById("diamstot");
        diamsHTML.innerHTML = nbrdiams;
        this.#totalDiams = nbrdiams;
        }
    }
   
    //retourne la position du joueur. Le fichier est considéré comme un tableau de une dimension.
    findPlayer(lines){
    for(let x=0; x<527; x++){
        if(lines[x] == "P"){
            console.log("Position du joueur :", x);
            return x; 
            }  
        }
    }

    //fonction qui appel nos deux fonctions principal
    Game(line){    
        this.CreationMapAvecFichierJEU(line);
        this.DeplacementJoueur(line);  
    }

    //affiche la tableau avec les div correspondantes sur la page web
    CreationMapAvecFichierJEU(lines){
        
    const diamsHTML = document.getElementById("diamants");
    const jeuHTML = document.querySelector("jeu");
    diamsHTML.innerHTML = this.diams;
    jeuHTML.innerHTML = "";

    //compteur "cmp" afin de pouvoir parcourir tout le tableau
    let cmp=0;

    //on crée des div de ligne que l'on remplit avec des div colonnes
    for(let ligne=0; ligne<16; ++ligne){
        const ligneadddiv = document.createElement("div");
        for(let col=0; col<32; ++col){
            const colonne = document.createElement("div");
            
            if(lines[cmp]=="V"){
                colonne.classList.add('vide');
            }
            else if(lines[cmp]=="D"){
                colonne.classList.add('diamant');
            }
            else if(lines[cmp]=="T"){
                colonne.classList.add('terre');
            }
            else if(lines[cmp]=="R"){                    
                colonne.classList.add('rocher');
            }
            else if(lines[cmp]=="P"){
                colonne.classList.add('placement_joueur');
            }
            else if(lines[cmp]=="M"){
                colonne.classList.add('mur');
            }
            else{
                console.log("probleme au niveau du choix de la lettre");
            }
            cmp++;
            ligneadddiv.appendChild(colonne);              
        }  
        cmp++;
        jeuHTML.appendChild(ligneadddiv);
        }  
    }

    //fonction qui gère le déplacement du joueur et les ses conséquences
    DeplacementJoueur(lines){
        //Statut pour ne pas pouvoir reprendre la partie si on est mort
        localStorage.setItem("Status_vie",true);
        let tab = lines;
        //actualx récupère la position actuel du joueur
        let actualx=this.findPlayer(tab);
        console.log("actualx", actualx);

        const loose = document.getElementById('loose');
        const diamsHTML = document.getElementById("diamants");
        const deplacementHTML = document.getElementById("deplacement");

        window.addEventListener('keydown', (event)=>{
            switch(event.key){

                case "z" : 
                //si il y a un nageur au dessus de lui et que le joueur monte, nombre de nageur +1
                if(this.detectionDiamant(-33)){
                    this.diams = this.diams +1;
                    diamsHTML.innerText = this.diams;
                    console.log("Nombre de nageurs mangés", this.diams);
                }
                actualx = this.findPlayer(tab);
                console.log("actualx", actualx);
                //on vérifie que la case au dessus du joueur n'est pas un mur sinon, il ne peut pas s'y deplacer
                if(tab[actualx -33] != "M"){  
                    //verification que la case du haut n'est pas un rocher
                    if(this.dectectionRocherHautBas(-33)){
                        console.log("bloquer par un rocher");
                    }
                    else{
                    //modifie la position actuel du joueur dans le tableau en une case "V"        
                    tab = this.modifChar(tab, actualx, "V");
                    //modifie la position au dessus du joueur dans le tableau en une case "P" 
                    //+33 car il y a 32 caracteres par ligne + le retour à la ligne donc 33     
                    tab = this.modifChar(tab, actualx - 33, "P");
                    //affiche la nouvelle carte après modification du tableau
                    this.CreationMapAvecFichierJEU(tab);
                    actualx = this.findPlayer(tab);
                    //récupère la valeur du tableau modifié dans un setter
                    this.lines = tab;
                    this.deplacement ++;
                    deplacementHTML.innerHTML = this.deplacement;
                    }
                
                //Vérifie que le nombre de nageurs mangés est == au nombre total de nageurs.
                //Si c'est le cas, le joueur à gagné la partie
                if(this.diams == this.#totalDiams){
                    console.log("Félicitation, vous avez gagné la partie");
                    this.Victoire();
                }
                //stock dans le localStorage la carte
                localStorage.setItem('map', tab);
                //stock dans le localStorage le nombre de déplacements
                localStorage.setItem('nbredeplacement', this.deplacement);
                //stock dans le localStorage le nombre de nageur mangé
                localStorage.setItem('nbrediamants', this.diams);
                }
                break;


                case "q" :
        
                if(this.detectionDiamant(-1)){   
                    this.diams = this.diams +1;          
                    diamsHTML.innerText = this.diams;
                    console.log("Nombre de nageurs mangés", this.diams);
                }
                actualx = this.findPlayer(tab);    
                if(tab[actualx -1] != "M"){
                    //Vérifie si à sa gauche un rocher est déplacable, c'est-à-dire un rocher avec du vide derrière
                    if(tab[actualx -1] == "R" && tab[actualx -2]=="V"){
                        tab = this.modifChar(tab, actualx, "V");    
                        tab = this.modifChar(tab, actualx - 1, "P")
                        tab = this.modifChar(tab, actualx-2, "R");    
                    }
                    else if(tab[actualx -1] == "R" && tab[actualx -2]!="V"){
                        console.log("Impossible de déplacer le rocher")
                    }
                    else{
                        tab = this.modifChar(tab, actualx, "V");    
                        tab = this.modifChar(tab, actualx - 1, "P")
                    }
                    //Vérifie si un rocher au dessus peut tomber
                    if(tab[actualx -33] == "R" && tab[actualx]=="V"){
                        let i=0;
                        let positionrochermouvement;
                        do{
                            //positionrochermouvement va permettre la chute du rocher jusqu'à trouver une case différente du vide en dessous de lui
                            positionrochermouvement=actualx+i*33;
                            tab = this.modifChar(tab, positionrochermouvement-33, "V");
                            tab = this.modifChar(tab, positionrochermouvement, "R");
                            i++;
                        }while(tab[actualx+i*33]=="V");
                    }
                    
                    this.CreationMapAvecFichierJEU(tab);
                    actualx = this.findPlayer(tab);
                    this.lines = tab;
                    this.deplacement ++;
                    deplacementHTML.innerHTML = this.deplacement;
                
                if(this.diams == this.#totalDiams){
                    console.log("Félicitation, vous avez gagné la partie");
                    this.Victoire();
                }
                localStorage.setItem('map', tab);
                localStorage.setItem('nbredeplacement', this.deplacement);
                localStorage.setItem('nbrediamants', this.diams);
                }
                break;


                case "s" :

                if(this.detectionDiamant(33)){
                    this.diams = this.diams +1;
                    diamsHTML.innerText = this.diams;
                    console.log("Nombre de nageurs mangés", this.diams);
                }
                actualx = this.findPlayer(tab);
                if(tab[actualx + 33] != "M"){  
                    if(this.dectectionRocherHautBas(+33)){
                        console.log("bloquer par un rocher");
                    }
                    else{
                    tab = this.modifChar(tab, actualx, "V");    
                    tab = this.modifChar(tab, actualx +33, "P")
                    //Si le joueur se fait écraser
                    if(tab[actualx -33]=="R" && tab[actualx]=="V"){
                            tab = this.modifChar(tab, actualx-33, "V");
                            tab = this.modifChar(tab, actualx, "V");
                            tab = this.modifChar(tab, actualx+33, "R");
                            localStorage.setItem("Status_vie",false);
                            console.log("Défaite, vous vous êtes fait écraser par un rocher !");
                            loose.style.display = "flex";
                            setTimeout(function(){           
                                //on recharge la page html 2 secondes après avoir affiché le gameover          
                                window.location.href = "index.html";                       
                            },2000);                          
                    }
                    this.CreationMapAvecFichierJEU(tab);
                    actualx = this.findPlayer(tab);
                    this.lines = tab;
                    this.deplacement ++;
                    deplacementHTML.innerHTML = this.deplacement;
                    }
                
                if(this.diams == this.#totalDiams){
                    console.log("Félicitation, vous avez gagné la partie");
                    this.Victoire();
                }
                localStorage.setItem('map', tab);
                localStorage.setItem('nbredeplacement', this.deplacement);
                localStorage.setItem('nbrediamants', this.diams);
            }
                break;


                case "d" :

                if(this.detectionDiamant(1)){
                    this.diams = this.diams +1;
                    diamsHTML.innerText = this.diams;
                    console.log("Nombre de nageurs mangés", this.diams);
                }    
                actualx = this.findPlayer(tab);    
                if(tab[actualx + 1] != "M"){
                    if(tab[actualx +1] == "R" && tab[actualx +2]=="V"){
                        tab = this.modifChar(tab, actualx, "V");    
                        tab = this.modifChar(tab, actualx + 1, "P")
                        tab = this.modifChar(tab, actualx+2, "R");    
                    }
                    else if(tab[actualx +1] == "R" && tab[actualx +2]!="V"){
                        console.log("impossible de deplacer le rocher")
                    }
                    else{
                    tab = this.modifChar(tab, actualx, "V");    
                    tab = this.modifChar(tab, actualx + 1, "P")
                    } 
                    if(tab[actualx -33] == "R" && tab[actualx]=="V"){
                        let i=0;
                        let positionrochermouvemenet;
                        do{
                            positionrochermouvemenet=actualx+i*33;
                            tab = this.modifChar(tab, positionrochermouvemenet-33, "V");
                            tab = this.modifChar(tab, positionrochermouvemenet, "R");
                            i++;
                        }while(tab[actualx+i*33]=="V");  
                    }
                this.CreationMapAvecFichierJEU(tab);
                actualx = this.findPlayer(tab);
                this.lines = tab;
                this.deplacement ++;
                deplacementHTML.innerHTML = this.deplacement;
                
                if(this.diams == this.#totalDiams){
                    console.log("Félicitation, vous avez gagné la partie");
                    this.Victoire();
                }
                localStorage.setItem('map', tab);
                localStorage.setItem('nbredeplacement', this.deplacement);
                localStorage.setItem('nbrediamants', this.diams);
            }
                break;         
            }      
            
        }            
    )     
}

    //Recharge la page html après une victoire
    Victoire(){
        const win = document.getElementById("win");
        win.style.display = "flex";
        setTimeout(function(){
                window.location.href = "index.html"  
        },2000);  
    }


    //permet modifier une valeur char dans le tableau en fonction d'un index
    modifChar(tab, index, char){
        if(index>tab.length-1){
            return tab;
        }
        else{
            //retourne le tableau avec le char modifié à l'endroit de l'index
            return tab.substring(0, index) + char + tab.substring(index+1);
        } 
    }

    //dectecte la présence d'un diamant
    detectionDiamant(index){  
        if(this.lines[this.findPlayer(this.lines)+index] == "D"){
            console.log("Un diamant !");
            return true;
        }  
    }

    //detecte la présence d'un rocher
    dectectionRocherHautBas(index){
        if(this.lines[this.findPlayer(this.lines)+index]=="R"){
            console.log("Un rocher !");
            return true;
        }
    }
    
}

const regle = document.getElementById('regle');
const reglediv = document.getElementById('reglediv');
regle.addEventListener('click', function(){
    if(reglediv.style.display == "flex"){
        reglediv.style.display = "none";
    }
    else {
        reglediv.style.display ="flex";
    }
})