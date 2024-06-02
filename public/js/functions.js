//const { isEmpty, toInteger } = require("lodash");

var avisaPrimeiraChamadaCep = false;
var valorTotalCesta; // valor da cesta > agora e um json
var optionCorreios;
// fim var globais 

window.onchange = setTimeout(function() { 
  var novoAcesso = Date.now(); // pega a data atual em milissegundos 1595023437623
  let paymentSpan = document.getElementById('paymentSpan'); 
  /*if(paymentSpan.innerHTML) {
    document.getElementById('payment').classList.remove("d-none"); // payment
    console.log(paymentSpan.innerHTML.length);
  }
  // devolvendo produtos ao estoque
  /*let CarrinhoParaCheckout = localStorage.getItem("CarrinhoParaCheckout"); // Recupera os dados armazenados CarrinhoParaCheckout
  let Contador_itens       = localStorage.getItem("Contador_itens"); // Recupera os dados armazenados CarrinhoParaCheckout
  if(CarrinhoParaCheckout) {
    if(Contador_itens) {}
    else {
      // returning products to stock
      CarrinhoParaCheckout     = JSON.parse(CarrinhoParaCheckout); // Converte string para objeto
      for(var i in CarrinhoParaCheckout) { 
          var cartJsonCheckout = JSON.parse(CarrinhoParaCheckout[i]);
          // url p/ teste write-off-product-inventory?produtoId=5&quantidade=1
          $.ajax({
              url:'/returning-products-to-stock',  
              data: { produtoId: cartJsonCheckout.ProdutoId, quantidade: cartJsonCheckout.Quantidade },
              complete: function (response) {
                  console.log(response.responseText);
              },
              error: function () {
                  alert('Erro');
              }
          });
      }
      localStorage.removeItem("CarrinhoParaCheckout");
      console.log("returning products to stock function ");
    }
  }*/

  if (localStorage.getItem("UltimoAcesso") == null) { // busca o Ultimo Acesso pelo localStorage, se null faz o set do primeiro
    //localStorage.removeItem("Welcome");
    localStorage.setItem("UltimoAcesso", novoAcesso);  
    AtualizaValorCart();
    AtualizaQtdeCart();
    } else {
    var ultimoAcesso = localStorage.getItem("UltimoAcesso"); // busca pelo localStorage ja salvo da ultima sessao
    var tempoAposUltimoAcesso = novoAcesso - ultimoAcesso;

    if (tempoAposUltimoAcesso < 1209600000) {  // 14 dias = 1209600000 ms
      AtualizaValorCart();
      AtualizaQtdeCart();
    } else {
      ApagaCarrinhoLocalStorage() // apaga todo o carrinho de localStorage quando tempo maio de 14 dias
    }
  }
  //BuscaCEP();
  FormataDadosEmMoedaMonetariaBr();
}, 1000); 

function FormataDadosEmMoedaMonetariaBr() {
    let precoAtual = document.getElementById('precoAtual').innerHTML;
    document.getElementById('precoAtual').innerHTML = parseFloat(precoAtual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let precoAnterior = document.getElementById('precoAnterior').innerHTML;
    document.getElementById('precoAnterior').innerHTML = parseFloat(precoAnterior).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });    
}

function AddToCart() {
  let display = document.getElementById('displayQtdeItem');
  let idproduto = document.getElementById('idproduto').value;
  let qtde_estoque = localStorage.getItem("Product"+idproduto); // Buscado do navegador do usuario
  if(qtde_estoque == null) {
    qtde_estoque = document.getElementById('qtde_estoque'); // dados preenchido com DB
    if(qtde_estoque == null) {
      qtde_estoque = 99;
    } else {
      qtde_estoque = parseInt(qtde_estoque.innerHTML); 
    }
  }

  if (qtde_estoque >= display.value) {
    let quantity  = document.getElementById('displayQtdeItem');
    let idProduto = document.getElementById('idproduto').value ;
    document.getElementById('plusNumberCart').classList.add("swing"); // fa-plus-number-zoom5
    document.getElementById('plusNumber').innerHTML = quantity.value; // displayQtdeItem
    localStorage.setItem("Product"+idproduto, qtde_estoque - display.value); // salvando em localStorage
    setTimeout(function() { AddItemLocalStorage(idProduto, quantity.value); }, 35); // Add Item e qtde de Produtos para LocalStorage
    setTimeout(function() { AtualizaValorCart(); }, 400);
    setTimeout(function() { AtualizaQtdeCart();  }, 500);
    AddToCartOver();
  } else {
    alert("Item nÃ£o disponÃ­vel no momento! \nQuantidade disponÃ­vel: "+qtde_estoque);
  }
}

function AddItemLocalStorage(idProduto, qtdeItem) {
  var MeuCarrinho          = localStorage.getItem("MeuCarrinho"); // Recupera os dados armazenados
  var CarrinhoParaCheckout = localStorage.getItem("CarrinhoParaCheckout"); // Recupera os dados armazenados
  var Contador_itens       = localStorage.getItem("Contador_itens"); // Recupera o numero de intens na cesta int

  if(MeuCarrinho == null || CarrinhoParaCheckout == null) { // Caso nÃ£o haja conteÃºdo, iniciamos vetor vazio
    MeuCarrinho = []; CarrinhoParaCheckout = []; Contador_itens = 0;
  } 
  else { // arquivo fora cdn disponivel em: public/assets/js/crypto-js-3.1.2-rollups-aes.js
    MeuCarrinho              = CryptoJS.AES.decrypt(MeuCarrinho, "Secret Passphrase"); // desencriptografa
    MeuCarrinho              = MeuCarrinho.toString(CryptoJS.enc.Utf8); // converte para acentuacao correta
    MeuCarrinho              = JSON.parse(MeuCarrinho); // Converte string para objeto
    CarrinhoParaCheckout     = JSON.parse(CarrinhoParaCheckout); // Converte string para objeto
  }

  var cart = JSON.stringify({
      ItemFoto    : $("#imagemPrincipal")[0].src, // pegando somente o caminho da imagem principal que est na posicao [0] do obj
      Produto     : $("#produtoName").html(),
      Unidade     : qtdeItem, // mesma coisa que document.getElementById('txtCodigo').value;
      PrecoDouble : $("#precoPorProd").val(),
      Preco       : $("#precoAtual").html()
  });

  var itemComQtde = JSON.stringify({
    ProdutoId         : idProduto,
    Quantidade        : qtdeItem
  });

  CarrinhoParaCheckout.push(itemComQtde); // Add obj ao vetor
  MeuCarrinho.push(cart); // Add obj ao vetor

  Contador_itens ++;
  MeuCarrinho = JSON.stringify(MeuCarrinho); // transforma em json
  CarrinhoParaCheckout = JSON.stringify(CarrinhoParaCheckout); // transforma em json
  MeuCarrinho = CryptoJS.AES.encrypt(MeuCarrinho, "Secret Passphrase"); // criptografa por seguranca
  
  localStorage.setItem("MeuCarrinho", MeuCarrinho); // salvando em localStorage
  localStorage.setItem("CarrinhoParaCheckout", CarrinhoParaCheckout); // salvando em localStorage
  localStorage.setItem("Contador_itens", Contador_itens);
}

function ApagaCarrinhoLocalStorage() {
  let user = localStorage.getItem("user");
  if(user) {
    localStorage.clear();
    localStorage.setItem("user", user);
  } else { localStorage.clear(); } 
  let data = new Date(2010,0,01); 
  data = data.toGMTString(); // Converte a data para GMT 
  document.cookie = 'contador_itens=; expires=' + data + '; path=/'; console.log("Apagando Carrinho.."); // Apaga o cookie
}

function MostrarCarrinho() { 
  let MeuCarrinho          = localStorage.getItem("MeuCarrinho");// Recupera os dados armazenados
  let CarrinhoParaCheckout = localStorage.getItem("CarrinhoParaCheckout");// Recupera os dados armazenados CarrinhoParaCheckout

  if (MeuCarrinho != undefined && CarrinhoParaCheckout != undefined) {
    CarrinhoParaCheckout     = JSON.parse(CarrinhoParaCheckout); // Converte string para objeto
    MeuCarrinho              = CryptoJS.AES.decrypt(MeuCarrinho, "Secret Passphrase"); // desencriptografa
    MeuCarrinho              = MeuCarrinho.toString(CryptoJS.enc.Utf8); // converte para acentuacao correta
    MeuCarrinho              = JSON.parse(MeuCarrinho); // Converte string para objeto

  $("#tblListar tbody").html(""); // necessario para limpar os elementos html e recrialos
  for(var i in MeuCarrinho){ // i equivale ao coontador, ex: 0,1,3,4,5..
      var cartJson = JSON.parse(MeuCarrinho[i]);
      var cartJsonCheckout = JSON.parse(CarrinhoParaCheckout[i]);
      
      $("#tblListar tbody").append(
          "<tr id='tableRow"+i+"'>"+
              "<td><img src='"+cartJson.ItemFoto+"' alt='"+cartJson.Produto+"' class='img img-responsive center-block' width='50' height='50'></td>"+
              "<td>"+cartJson.Produto+"</td>"+
              "<td><span id='tableRowQtde"+i+"'>"+cartJsonCheckout.Quantidade+"</span> X </td>"+
              "<td>"+cartJson.Preco+"</td>"+
              "<td><button id='"+i+"' value='"+cartJson.PrecoDouble+"' onclick='RemoveItemDoMostrarCarrinho(id);' rel='tooltip' title='Remover'><i class='fa fa-times'></i></button></td>"+
          "</tr>");
  } // end for
  let valorTotal = "Valor Produtos: Carregando..";
      $("#valorTotal").html(valorTotal); // valorTotal
  setTimeout(function() { // usado timeout para dar tempo de atualizar o valor do carrinho header
      let valorTotal = document.getElementById('cartTotalValue').value;
      $("#valorTotal").html("Valor Produtos: "+ parseFloat(valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })); // valorTotal
  }, 500);
} else {
  $("#tblListar tbody").html("<td><h6><b>Carrinho vazio!</b></td> <td><h5>Adicione produtos</td><td>0</td><td>R$0,00</td></h6>"); // 
}   
}

function RemoveItemDoMostrarCarrinho(id) {
  let idproduto    = document.getElementById('idproduto').value;
  let qtde_estoque = localStorage.getItem("Product"+idproduto); // Buscado do navegador do usuario
  let tableRowQtde = document.getElementById("tableRowQtde"+id); // tableRow0, tableRow1..
  tableRowQtde = parseInt(tableRowQtde.innerHTML); qtde_estoque = parseInt(qtde_estoque);
  qtde_estoque = qtde_estoque + tableRowQtde;
  localStorage.setItem("Product"+idproduto, qtde_estoque); // salvando em localStorage
  console.log(tableRowQtde.innerHTML);

  MeuCarrinho          = localStorage.getItem("MeuCarrinho");
  CarrinhoParaCheckout = localStorage.getItem("CarrinhoParaCheckout");

  MeuCarrinho          = CryptoJS.AES.decrypt(MeuCarrinho, "Secret Passphrase"); // desencriptografa
  MeuCarrinho          = MeuCarrinho.toString(CryptoJS.enc.Utf8); // converte para acentuacao correta
  MeuCarrinho          = JSON.parse(MeuCarrinho); // Converte string para objeto

  CarrinhoParaCheckout = JSON.parse(CarrinhoParaCheckout); // Converte string para objeto
  MeuCarrinho.splice(id, 1);
  CarrinhoParaCheckout.splice(id, 1);
  //console.log('id:'+id);
  setTimeout(function() { AtualizaValorCart() }, 400);

  //$('#tableRow'+id+'').html(''); // Remove o elemento tr com id="id" ex: id="0","2".. 
  $("#tblListar tbody").html(""); // necessario para limpar os elementos html e recrialos
  for(var i in MeuCarrinho){ // i equivale ao coontador, ex: 0,1,3,4,5..
      var cartJson = JSON.parse(MeuCarrinho[i]);
      var cartJsonCheckout = JSON.parse(CarrinhoParaCheckout[i]);
      $("#tblListar tbody").append(
          "<tr id='tableRow"+i+"'>"+
              "<td><img src='"+cartJson.ItemFoto+"' alt='"+cartJson.Produto+"' class='img img-responsive center-block' width='50' height='50'></td>"+
              "<td>"+cartJson.Produto+"</td>"+
              "<td><span id='tableRowQtde"+i+"'>"+cartJsonCheckout.Quantidade+"</span> X </td>"+
              "<td>"+cartJson.Preco+"</td>"+
              "<td><button id='"+i+"' value='"+cartJson.PrecoDouble+"' onclick='RemoveItemDoMostrarCarrinho(id);' rel='tooltip' title='Remover'><i class='fa fa-times'></i></button></td>"+
          "</tr>");
  }
  $("#cartTotalValue").val(cartTotalValue); 
  let TotalValueFormatad = parseFloat(cartTotalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  $("#TotalValueFormatad").html(TotalValueFormatad); // TotalValueFormatad
  
  // parseFloat(precoAnterior).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  let valorTotal = "Valor Produtos: Carregando..";
  $("#valorTotal").html(valorTotal); // valorTotal
setTimeout(function() { // usado timeout para dar tempo de atualizar o valor do carrinho header
  let valorTotal = document.getElementById('cartTotalValue').value;
  $("#valorTotal").html("Valor Produtos: "+ parseFloat(valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })); // valorTotal
}, 500);

  let Contador_itens = localStorage.getItem("Contador_itens");
  Contador_itens --;
  localStorage.setItem("Contador_itens", Contador_itens);
  AtualizaQtdeCart(); 

  MeuCarrinho = JSON.stringify(MeuCarrinho); // transforma em json
  MeuCarrinho = CryptoJS.AES.encrypt(MeuCarrinho, "Secret Passphrase"); // criptografa por seguranca
  localStorage.setItem("MeuCarrinho", MeuCarrinho);
  localStorage.setItem("CarrinhoParaCheckout", JSON.stringify(CarrinhoParaCheckout));
}

function AtualizaQtdeCart() { 
  let totalDeItemCart = localStorage.getItem("Contador_itens");
  document.getElementById('carrinhoQtde').innerHTML = totalDeItemCart; // Altera o front HTML escrendo com JS

  if(totalDeItemCart >= 1) {
    document.getElementById('btnCheckout').disabled = false;
  } else {
    document.getElementById('btnCheckout').disabled = true;
  }
}

function AtualizaValorCart() { // function carrega apos o load da pag, apaga o carrinho se o cookie contador_itens != de Contador_itend do localStorage

  if(localStorage.getItem("Contador_itens") != null && localStorage.getItem("Contador_itens") != 0)
  {
    document.getElementById('carrinhoQtde').classList.remove("d-none");
    $.ajax({
      url:'/atualiza_valor_cart',  
      data: { cart: localStorage.CarrinhoParaCheckout, contadorLocalStorage: localStorage.Contador_itens,},
      complete: function (response) {
        valorTotalCesta = response.responseText; console.log(valorTotalCesta);
        valorTotalCesta = JSON.parse(valorTotalCesta); // Converte json para objeto
        valorTotalCesta = valorTotalCesta.valorTotal;
        let totalValueCart = CryptoJS.AES.encrypt(""+valorTotalCesta+"", "Secret Passphrase"); // criptografa por seguranca
        localStorage.setItem("totalValueCart", totalValueCart);
        let carrinhoQtde = document.getElementById('carrinhoQtde');  // pega valor do input html

        if (carrinhoQtde.innerHTML != 0) {
          document.getElementById('cartTotalValue').value = valorTotalCesta;
          document.getElementById('totalDeCompra').innerHTML = "Total da Compra " + parseFloat(valorTotalCesta).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          document.getElementById('TotalValueFormatad').innerHTML = parseFloat(valorTotalCesta).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
      },
      error: function () {
        ApagaCarrinhoLocalStorage(); //alert('Erro');
      }
    });
  }    
}

function AddToCartOver() { // Efeito do numero subindo ao Add itens: +1, +2, +5..
  document.getElementById('plusNumberCart').classList.remove("swing"); // fa-plus-number-zoom5
}

function MascaraCep() {
  setTimeout(function() { 
  document.getElementById('inputTxtCep').style.backgroundColor = "transparent"; 
  document.getElementById('inputTxtCep').focus(); }, 200);
}

function BuscaCEP(add) {  // Referencia da API em: http://cep.la/api
  document.getElementById('btnCalcCep').innerHTML = "..";
  document.getElementById('btnCalcCep').disabled = true; // desativa nova chamada pelo button
  let cepTo = document.getElementById('inputTxtCep').value; 
  cepTo = cepTo.replace(/[^\d]+/g,''); // entrada 82630-000  saida 82630000

  if (cepTo != "" && cepTo.length == 8) {
    
    $.ajax({
      url:'/busca-cep',
      data: { cep: cepTo },
      complete: function (response) {  
        let respJson = JSON.parse(response.responseText); // JSON.parse(cep); // Converte json para objeto
        if (respJson.cidade != undefined) {
          console.log(respJson);
          CalcularFreteAjax(add); // CEP correto entao podemos chamar a function CalcularFreteAjax(cep)
        } else {
          console.log(respJson);
          alert("Cep invÃ¡lido ou incorreto!");
          document.getElementById('btnCalcCep').disabled = false; // enabled
          document.getElementById('btnCalcCep').innerHTML = "OK";
        }
      }
    })  
  } else {
    document.getElementById('AlertInformeCep').classList.add("show");
    document.getElementById('AlertInformeCep').setAttribute("style", "z-index: 30;");
    setTimeout(function() { 
      document.getElementById('AlertInformeCep').classList.remove("show"); 
      document.getElementById('AlertInformeCep').setAttribute("style", "z-index: -1;");
    }, 4000);
    document.getElementById('btnCalcCep').disabled = false; // enabled
    document.getElementById('btnCalcCep').innerHTML = "OK";
  }
} 

function CalcularFreteAjax(add) { // Requisacao ajax para Calcular Frete / function name before chamarPhpAjax()
  let cepTo     = document.getElementById('inputTxtCep'); 
  let cepFrom   = "82400-000"; // Logradouro Nome:	Bairro Distrito: Localidade UF:	CEP: Avenida Manoel Ribas - de 4557 - 4558 a 7369-7370 
  let idProduto = document.getElementById('idproduto').value ;
  let quantity  = document.getElementById('displayQtdeItem');
  let height    = document.getElementById('box_dimensions_height');
  let width     = document.getElementById('box_dimensions_width');
  let length    = document.getElementById('box_dimensions_length');
  let weight    = document.getElementById('box_weight');
  let boxInsuranceValue = document.getElementById('box_insurance_value');

  var settings = {
    "url": "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI5YzkyYzg0YTdmZTFhODA1YjY2MTE3ZjE4NTRjYzVmNzBhZTcyNmY5NGJkNTc4M2MzMWEzYmM2NTFmZDRkMWUyZDFiYzk3ZmIyNzFlYjBkIn0.eyJhdWQiOiI5NTYiLCJqdGkiOiIyOWM5MmM4NGE3ZmUxYTgwNWI2NjExN2YxODU0Y2M1ZjcwYWU3MjZmOTRiZDU3ODNjMzFhM2JjNjUxZmQ0ZDFlMmQxYmM5N2ZiMjcxZWIwZCIsImlhdCI6MTYyODY4MTA3MywibmJmIjoxNjI4NjgxMDczLCJleHAiOjE2NjAyMTcwNzMsInN1YiI6ImYyYjUxNTI3LTc3ZTktNGJmYy05ZjY5LTkzYTBjNjlmOWE1ZCIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIl19.iivdlgVomEf3mr_06zK5pRLUiCKNCfepxiu8199qDbZxmw0nTQji2J76noELxONwuSrfsbiUq01gljDi0X-Jn9vz9Z7C-1-j2bEkJHNFmCzngli7cN3mIa6R0VCRY0-wQkERDzonZ-tb4fiu7jzc34N5-Q1Sl2nSPhjKGAiPIRcfvxpH0Cxx791e9M36EGsCPulNZfurxNQ7yiSnMp1nh5KMsJ72v55LtsEw_kU5jajXh5gQcZSl7sGf0ij7VxRdG93R4zzBUXo25qfNWDEbvViKb67UiGH9N7ADnUsPW6Qwj6EpmBoZPyUjes3AKD5le50y-nZ4CyYZKXGux1DUAy8DSeVhZ58NgFG0xhTzIw78PRBX7S9lXWWkwgQ2AJIgGLPiC1UwNlsetOxvnxPm6UYToqkwd6B-uFNzLklIjHqLah2heL-OR0Ns7cmdJWhqA9C_qPzqTsJE13mMyXQUrZjhd4nVC-xprh6FSeyJx3dYzmDbGQvS6THRX29CgRKgs-f0_kqUkyUOg-3tAQJYFuVF5ZmRpZe8ygIvRN6Am34btDbDRUjeC_Vi1ToJgGYvYQjuwu-WDJcsYvrAp71tjY6S1KeqdRLxCfEXyXEafGAeAwIXg9S2uEB9p27s4frl8Zkyx3FhLkhv8XLzaqnmEUVdWWyyYTzZNZZEg4ki50A",
      "User-Agent": "AplicaÃ§Ã£o (email para contato tÃ©cnico: marciel.emersom@gmail.com)"
    },
    "data": JSON.stringify({"from":{"postal_code":cepFrom},"to":{"postal_code":cepTo.value},"products":[{"id":idProduto,"width":width.innerHTML,"height":height.innerHTML,"length":length.innerHTML,"weight":weight.innerHTML,"insurance_value":boxInsuranceValue.value,"quantity":quantity.value}]}),
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    localStorage.setItem("CepComMascara", cepTo.value);
    let valorPacValorSedex = response;
    preencheHtmlComCep(valorPacValorSedex); // valorPacValorSedex > json
  });

  document.getElementById('btnCalcCep').disabled = false; // enabled
  document.getElementById('btnCalcCep').innerHTML = "OK";
}

function preencheHtmlComCep(valorPacValorSedex) {
  var optionCorreios = localStorage.getItem("OptionCorreios");
  if (optionCorreios == null) {
    document.getElementById('groupBtnRadioCorreios').classList.remove("d-none");

  } else {
    document.getElementById('groupBtnRadioCorreios').classList.remove("d-none");
    LoadOptionCorreios(optionCorreios); // carrega apenas a opcao escolhida pelo cliente
  }

  let labelRadioSedex = document.getElementById('sedexOption');
  let labelRadioPac   = document.getElementById('pacOption');

  var pacObj = valorPacValorSedex[0]; // 
  if (pacObj.error != undefined) { // error==undefined
    labelRadioPac.innerHTML = pacObj.name+' '+pacObj.error;
    labelRadioPac.disabled = true;
    labelRadioPac.style.cursor = "help";
  } else {
    labelRadioPac.innerHTML = "<input type='checkbox' id='checkbox_pac' class='checkbox-correios'>"+pacObj.name+' R$'+pacObj.price+' aprox. '+pacObj.delivery_time+' dias';
    localStorage.setItem("CurrentValorPAC", pacObj.price);
  }

  var sedexObj = valorPacValorSedex[1]; //
  if (sedexObj.error != undefined) { // error==undefined
    labelRadioSedex.innerHTML = sedexObj.name+' '+sedexObj.error;
    labelRadioSedex.disabled = true;
    labelRadioSedex.labelRadioPac.style.cursor = "help";
  } else {
    labelRadioSedex.innerHTML = "<input type='checkbox' id='checkbox_sedex' class='checkbox-correios'>"+sedexObj.name+' R$'+sedexObj.price+' aprox. '+sedexObj.delivery_time+' dias';
    localStorage.setItem("CurrentValorSEDEX", sedexObj.price);
  }
}

function LoadOptionCorreios(id) { // ID = PAC ou SEDEX
  var optionCorreios = localStorage.getItem('OptionCorreios');

  if (id == "pacOption" || optionCorreios == 'PAC') { // id recebe sedex pra todos se j foi ecolhido(mantem o mesmo tipo pra todos demais itens)
    localStorage.setItem("OptionCorreios", "PAC"); // optionCorreios
    document.getElementById('inputTxtCep').disabled = true;
    document.getElementById('inputTxtCep').value = localStorage.getItem("CepComMascara");
    document.getElementById('btnCalcCep').classList.add("d-none");
    document.getElementById('sedexOption').classList.add("d-none"); // input sedexOption 
    setTimeout(function() { 
      AtualizaValorCart(); 
      document.getElementById('checkbox_pac').checked = true;
    }, 1000);

  } else if (id == "sedexOption" || optionCorreios == 'SEDEX') { // id recebe Pac pra todos se j foi ecolhido(mantem o mesmo tipo pra todos demais itens)
    localStorage.setItem("OptionCorreios", "SEDEX"); // optionCorreios
    document.getElementById('inputTxtCep').disabled = true;
    document.getElementById('inputTxtCep').value = localStorage.getItem("CepComMascara");
    document.getElementById('btnCalcCep').classList.add("d-none"); // input do button CEP
    document.getElementById('pacOption').classList.add("d-none"); // input pacOption 
    setTimeout(function() { 
      AtualizaValorCart(); 
      document.getElementById('checkbox_sedex').checked = true;
    }, 1000);
  } 
  if (optionCorreios == undefined) {
    document.getElementById('btnCalcCep').disabled = false;
  } 
  setTimeout(function() { AtualizaQtdeCart();  }, 700);
  setTimeout(function() { AddToCartOver();     }, 700);
}

function AlteraItem(id) { // Vale para adicionar e remover und 
    let display = document.getElementById('displayQtdeItem');
    id_product = document.getElementById('idproduto');
    let qtde_estoque = localStorage.getItem("Product"+id_product); // Buscado do navegador do usuario

    if(qtde_estoque == null) {
      qtde_estoque = document.getElementById('qtde_estoque'); // dados preenchido com DB
      if(qtde_estoque == null) {
        qtde_estoque = 99;
      } else {
        qtde_estoque = parseInt(qtde_estoque.innerHTML); 
      }
    } console.log("Product:"+qtde_estoque);

    if (id == 'btnAddItem' && display.value < 9) {
      display.value++; console.log('display.value:' + display.value);
      //let idproduto = document.getElementById('idproduto').value;
      //localStorage.setItem("Product"+idproduto, qtde_estoque); // salvando em localStorage
      //document.getElementById('qtde_estoque').innerHTML = qtde_estoque -1;
    } else if (id == 'btnRemoveItem' && display.value > 1) {
      display.value--; console.log('display.value:' + display.value);
    }

    setTimeout(function () {
      document.getElementById('AlertQtdeAlterado').classList.remove("show");
      document.getElementById('AlertQtdeAlterado').classList.add("d-none");
    }, 3500);
}			

function InfoAdd() {
  document.getElementById('infoAdd').classList.add("active");
  document.getElementById('descGeral').classList.remove("active");
  document.getElementById('descGeralBody').setAttribute("style", "display: none;");
  document.getElementById('infoAddBody').setAttribute("style", "display: block;");
}

function DescGeral() {
  document.getElementById('descGeral').classList.add("active");
  document.getElementById('infoAdd').classList.remove("active");
  document.getElementById('infoAddBody').setAttribute("style", "display: none;");
  document.getElementById('descGeralBody').setAttribute("style", "display: block;");
}
/** troca as fotos da galeria show produtos */
function TrocaFotoGaleriaMobile(id) {
  item_index.classList.add("item-index-hidden"); // item_index add dysplay none css
  var itensElementsHtml = document.getElementsByClassName("galeria-m"); // mostra o todos item elementHtml com a classe="galeria-m"
  let itemId_clicked = document.getElementById('itemId_'+id); // carrega o elemento html clicado
  console.log(itemId_clicked, id);
  for (var contador = 0; itensElementsHtml.length > contador; contador++) {
    // laco de repiticao para esconder toda a galeria
    itensElementsHtml[contador].classList.add("item-hidden");
  }
  // mostra o a imagem do elemento html clicado
  itemId_clicked.classList.remove("item-hidden"); // remove class="item-hidden" no doc m_style.css
}

function CloseMsgOrder() {
  document.getElementById('payment').classList.add("d-none"); // payment
  console.log("CloseMsgOrder()");
}
/** fim linhas */