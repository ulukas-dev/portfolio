var opcoes = [

    'Informática',
    'Vestuário',
    'Lojas'
 ]

var d = document.getElementById('category') 

for(let i = 0; i < opcoes.length; i++){

   const option = document.createElement('option')

   option.textContent = opcoes[i]
   d.appendChild(option)

}