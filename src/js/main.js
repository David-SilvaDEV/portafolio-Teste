const card = document.querySelector('.habilidades');
const texto = document.querySelector('.habilidades-texo');
const contenedor = document.querySelector('.section-cards');
const coraje = document.querySelector('.coraje');

let abierta = false;

card.addEventListener('click', () => {
    const anchoContenedor = contenedor.clientWidth;
    const anchoCard = card.clientWidth;

    const movimiento = anchoContenedor - anchoCard - 10; // 10px de margen

    if (!abierta) {
        card.style.left = `${movimiento}px`; // se mueve hasta el borde derecho
        texto.style.width = "70%";
        texto.style.opacity = "1";
         coraje.style.display = "none"
        
        
        abierta = true;
    } else {
        card.style.left = "0px"; // vuelve al origen
        texto.style.width = "0";
        texto.style.opacity = "0";
        coraje.style.display = "flex"
        
        
        abierta = false;
    }
});
