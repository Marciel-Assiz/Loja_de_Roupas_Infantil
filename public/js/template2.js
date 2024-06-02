/* 
  functions sao carregadas para todas as pag desk/mobile que precisam mostrar o carrinho modal 
  Para trabalhar com criptografia CriptoJS, usado na function MostrarCarrinho(), deve iserir a tag abaixo no inicio(head) do documento HTML:
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js" integrity="sha256-/H4YS+7aYb9kJ5OKhFYPUjSJdrtV6AeyJOtTkw6X72o=" crossorigin="anonymous"></script>
*/

window.onchange = setTimeout(function() { 
    SearchUser();
  }, 1000); 
  
  function ComprarAgora(comprarAgora) {
      if (comprarAgora == true) {
          console.log("ComprarAgora(); on");
          AddToCart();
      }
      setTimeout(function() { MostrarCarrinho(); }, 100);
  
      $("#tblListar").html("");
      $("#tblListar").html(
          "<thead>"+
          "   <tr>"+
          "   	<th>Item</th>"+
          "   	<th>Produto</th>"+
          "   	<th>UND </th>"+
          "   	<th>R$</th>"+
          "   </tr>"+
          "</thead>"+
          "<tbody>"+
          "</tbody>"
          );    
  } 
  
  function SearchButton() {
    console.log("SearchButton() extend");
    document.getElementById('form_search').classList.add("form-search-extend");
    document.getElementById('search_key').classList.remove("d-none"); 
    document.getElementById('logo_mobile').classList.add("d-none");
  }
  
  function SearchClose() {
    console.log("SearchButton() close");
    document.getElementById('form_search').classList.remove("form-search-extend");
    document.getElementById('search_key').classList.add("d-none");
    document.getElementById('logo_mobile').classList.remove("d-none");
  }			
  
  function CheckRecurringColorsHeader() {
    let squareColor = document.querySelectorAll(".square-color-t");  console.log(squareColor.length);
    var branco=0, preto=0, marrom=0, cinza=0, verde=0, amarelo=0, vermelho=0, roxo=0, rosa=0, lilas=0, azul=0;
    for (let i = 0; i < squareColor.length; i++) {
      let color = squareColor[i].firstElementChild.classList[1];
  
      switch (color) {
        case 'cor-branco':
          if(branco > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          branco ++;
        break;
  
        case 'cor-preto':
          if(preto > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          preto ++;
        break;
  
        case 'cor-marrom':
          if(marrom > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          marrom ++;
        break;
  
        case 'cor-cinza':
          if(cinza > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          cinza ++;
        break;
  
        case 'cor-verde':
          if(verde > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          verde ++;
        break;
  
        case 'cor-amarelo':
          if(amarelo > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          amarelo ++;
        break;
  
        case 'cor-vermelho':
          if(vermelho > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          vermelho ++;
        break;
  
        case 'cor-roxo':
          if(roxo > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          roxo ++;
        break;
  
        case 'cor-rosa':
          if(rosa > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          rosa ++;
        break;
  
        case 'cor-lilas':
          if(lilas > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          lilas ++;
        break;
  
        case 'cor-azul':
          if(azul > 0) {
            squareColor[i].firstElementChild.classList.add("d-none");
          }
          azul ++;
        break;
      }
    }
  }
  
  $(function(){  // function para logar
    $('form[name="formLogin"]').submit(function(event){
        event.preventDefault(); // event.preventDefault() => Evita que o form seja enviado atualizando a pag como no PHP 
        let btnCloseLogin   = document.getElementById("btnCloseLogin")
        let unauthenticated = document.getElementById('unauthenticated'); 
        let messageBody     = document.getElementById('messageBody');
        let subMenu         = document.getElementById('sub_menu'); // sub_menu
  
        $.ajax({
            url: "/login",
            type: "post",
            data: $(this).serialize(), // this => Ã‰ o prÃ³prio elemento form
            dataType: 'json',
            statusCode:{ 419: function(){
                    messageBody.classList.add("alert-danger");
                    messageBody.innerText = "Erro: A pagina serÃ¡ recarregada. Tente novamente!";
                    setTimeout(function(){ document.location.reload(true); }, 2000);
                }
            },
            success: function(response){
                console.log(response);
            }
        }).done(function() {
            subMenu.classList.remove("d-none");
            messageBody.classList.remove("d-none");
            messageBody.classList.remove("alert-danger");
            messageBody.classList.add("alert-success");
            messageBody.innerText = "Logado com sucesso! Seja bem vindo(a)";
            unauthenticated.classList.add("d-none");
            SearchUser();
            setTimeout(function(){ btnCloseLogin.click(); }, 3000)
        })
        .fail(function() { // 419 (unknown status) ou 422 (Unprocessable Entity)
            messageBody.classList.remove("d-none");
            messageBody.classList.remove("alert-success");
            messageBody.classList.add("alert-danger");
            messageBody.innerText = "Erro: Email ou senha incorreta. Revise suas credencias!";
        })
    });
  });
  
  function SearchUser(){
    $.ajax({
            url: "/login/search-user",
            type: "get",
            dataType: 'json',
            success: function(response){
              if(response != null){
                localStorage.setItem("user", JSON.stringify(response)); // JSON.stringify(json) converte um objeto para json
                WriteInTheSubMenu(); 
              }
              console.log(response);
            }
    }).fail(function() { // 419 (unknown status) ou 422 (Unprocessable Entity)
        console.log("SearchUser() fail");
    })
  }
  
  function WriteInTheSubMenu() { // Escreve na div id="sub_menu" com os dados do user SearchUser()
    let userName  = document.getElementById('user_name');
    let userAdmin = document.getElementById('user_admin');
    let user      = localStorage.getItem("user"); user = JSON.parse(user);
    userName.parentNode.classList.remove("d-none");
    userName.innerText = "OlÃ¡ "+user.name;
    document.getElementById('unauthenticated').classList.add("d-none");
    document.getElementById('sub_menu').classList.remove("d-none");
    if(user.admin == 1){
      userAdmin.classList.remove("d-none");
    }
  }
  /*function Objeto(){
  {
    "id": 1,
    "ativo": null,
    "name": "Marciel E Assiz",
    "nickname": null,
    "email": "marciel.emersom@gmail.com",
    "description": "moderator",
    "image": null,
    "admin": 1,
    "cliente_id": null,
    "created_at": "2020-05-06 01:18:12",
    "updated_at": "2020-05-06 01:18:12"
  }*/
  
  $(function(){  // function para deslogar
    $('form[name="formLogout"]').submit(function(event){
        event.preventDefault(); // event.preventDefault() => Evita que o form seja enviado atualizando a pag como no PHP 
        let msgLogout       = document.getElementById('msgLogout'); // msgLogout
        let bgBlur          = document.getElementById('backgroundBlur'); // backgroundBlur
        let messageBody     = document.getElementById('messageBody'); // messageBody
        let unauthenticated = document.getElementById('unauthenticated'); // NÃ£o autenticado
        let userAdmin       = document.getElementById('user_admin'); 
        let subMenu         = document.getElementById('sub_menu'); // sub_menu
  
        $.ajax({
            url: "/logout",
            type: "get",
            data: $(this).serialize(), // this => Ã‰ o prÃ³prio elemento form
            dataType: 'json',
            success: function(response){
                console.log(response);
            }
        }).done(function() {
          localStorage.removeItem("user");
          msgLogout.classList.add("msg-logout-show"); // desativatar com setTimeOut
          bgBlur.classList.add("bg-blur-show"); // desativatar com setTimeOut
          bgBlur.classList.remove("bg-blur"); // desativatar com setTimeOut
          messageBody.classList.add("d-none");
          unauthenticated.classList.remove("d-none");
          userAdmin.classList.add("d-none");
          subMenu.classList.add("d-none");
          console.log("Logout whit successfuly");
          setTimeout(function(){
              msgLogout.classList.remove("msg-logout-show"); 
              msgLogout.classList.add("msg-logout"); 
          }, 2500);
          setTimeout(function(){
              bgBlur.classList.remove("bg-blur-show");  
              bgBlur.classList.add("bg-blur");  
          }, 3000);
        })
        .fail(function() { // 419 (unknown status) ou 422 (Unprocessable Entity)
            alert("Fail Logout");
        })
    });
  });
  
  function CheckIfLoggedIn() {
    let userName = document.getElementById('user_name');
  
    if(userName.innerText.length > 3) {
      window.location.href="/checkout"; // chama checkout window.location.href 
    } else {
      document.getElementById('linkLogin').click(); // chama modal login
    }
    console.log("CheckIfLoggedIn start "+ userName.innerText.length);
  }
  
  var prevScrollpos = window.pageYOffset;
  function onscroll() {
    const currentScrollPos = window.pageYOffset;
    const anime = document.getElementById('anime');
    const logo_demo = document.getElementById('logo_demo');
    const demowrapmac = document.getElementById('demowrap'); // id="demowrap" macbook
    //const nav_static = document.getElementById('nav_static'); // menu como a foto logo 
    const menu_nav = document.getElementById('menu_nav'); // menu busca, hamburger, cart nav fixado
    const subMenuNav = document.getElementById('sub_menu_nav'); // sub menu nav, categorias/sub-categorias/produtos
  
  
    //console.log("pageYOffset = " + window.pageYOffset); // apagar, somente p/ mostrar a posicao da altura em px
  
      if (window.pageYOffset < 300) {
        // sena 0 = somente o background image e mostrado
        //nav_static.classList.remove("nav_static_fixed"); 
        menu_nav.classList.remove("menu_nav_fixed");
        subMenuNav.classList.remove("sub-menu-nav-fixed");
        console.log("menu_nav remove fixed window.pageYOffset < 400px");
  
      }
      else if(window.pageYOffset > 300 && window.pageYOffset < 900) {
        menu_nav.classList.add("menu_nav_fixed");
        subMenuNav.classList.add("sub-menu-nav-fixed");
        console.log("menu_nav_fixed window.pageYOffset > 300px");
      }
  
      else if(window.pageYOffset > 649 && window.pageYOffset < 900) {
        menu_nav.classList.add("menu_nav_fixed");
        subMenuNav.classList.add("sub-menu-nav-fixed");
        console.log("menu_nav_fixed window.pageYOffset > 649px");
      }
  
      else if(window.pageYOffset > 900 && window.pageYOffset < 980) {
        //nav_static.classList.remove("nav_static_fixed");
        menu_nav.classList.add("menu_nav_fixed");
        subMenuNav.classList.add("sub-menu-nav-fixed");
        console.log("menu_nav_fixed window.pageYOffset > 900px");
      }
  
      else if(window.pageYOffset > 980 && window.pageYOffset < 1180 ) {
        menu_nav.classList.add("menu_nav_fixed");
        subMenuNav.classList.add("sub-menu-nav-fixed");
        console.log("menu_nav_fixed window.pageYOffset > 980px");
      }
  
      else if(window.pageYOffset > 1180 && window.pageYOffset < 1380 ) {
        menu_nav.classList.add("menu_nav_fixed");
        subMenuNav.classList.add("sub-menu-nav-fixed");
        console.log("menu_nav_fixed window.pageYOffset > 1180px");
      }
  
      else if(window.pageYOffset > 1380 && window.pageYOffset < 1580 ) {
        menu_nav.classList.add("menu_nav_fixed");
        subMenuNav.classList.add("sub-menu-nav-fixed");
        console.log("menu_nav_fixed window.pageYOffset > 1380px");
      }
  
      
  
  
      prevScrollpos = currentScrollPos;
  }