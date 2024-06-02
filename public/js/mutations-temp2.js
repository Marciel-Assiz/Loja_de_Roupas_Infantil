/**
 * Usada para fazer as mutacoes dos elementos HTML das pag menu-nav, dropdown, template(desk), index(desk) 
 */
var widthDropdownPro;
var widthDropdown4;
var widthDropdown3;
var widthDropdown2;
var widthDropdown1;
var stateMenu = "close";
// var globais

function OpenDropdownPro() {
    let sub_menu1 = document.getElementById('sub_menu1').offsetWidth;
    let sub_menu2 = document.getElementById('sub_menu2').offsetWidth;
    let sub_menu3 = document.getElementById('sub_menu3').offsetWidth;
    let sub_menu4 = document.getElementById('sub_menu4').offsetWidth;
    let sub_menu_prod = document.getElementById('sub_menu_prod').offsetWidth;
    let totalWidth = document.getElementById('sub_menu_nav').offsetWidth;  // pega largura total do menu-nav
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown5');

    let total = sub_menu1 + sub_menu2 + sub_menu3 + sub_menu4 + sub_menu_prod;
    let espace = (totalWidth - total) / 2;
    widthDropdownPro = 10;
    sub_menu_dropdown.setAttribute("style", "transition: .2s; opacity:1; display:block; left:auto; left: " + widthDropdownPro + "%;");
    console.log("OpenDropdown() start" + widthDropdownPro + " espace:" + espace);
}

function CloseDropdownPro() {
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown5');
    sub_menu_dropdown.setAttribute("style", "transition: .5s; delay-transition:1s; display:none; left:auto; right: " + widthDropdownPro + "px;");
}

function OpenDropdown1() {
    document.getElementById('sub_menu_dropdown1').setAttribute("style", "transition: .2s; opacity:1; display:block; left: 0");
    //document.getElementById('sub_menu_dropdown1').classList.add("OpenDropdown1");
    console.log("OpenDropdown1()");
}

function CloseDropdown1() {
    document.getElementById('sub_menu_dropdown1').setAttribute("style", "transition: .2s; opacity:0; display: none;");
    //document.getElementById('sub_menu_dropdown1').classList.remove("OpenDropdown1");
    console.log("CloseDropdown1()");
}

function OpenDropdown2() {
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown2');
    sub_menu_dropdown.setAttribute("style", "transition: .2s; opacity:1; display:block; left: 10%;");
    console.log("OpenDropdown() start");
}

function CloseDropdown2() {
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown2');
    sub_menu_dropdown.setAttribute("style", "transition: .5s; delay-transition:1s; display:none; left:auto; right: " + widthDropdown1 + "px;");
}

function OpenDropdown3() {
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown3');
    sub_menu_dropdown.setAttribute("style", "transition: .2s; opacity:1; display:block; left: 10%;");
    console.log("OpenDropdown() start");
}

function CloseDropdown3() {
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown3');
    sub_menu_dropdown.setAttribute("style", "transition: .5s; delay-transition:1s; display:none; left:auto; right: " + widthDropdown1 + "px;");
}

function OpenDropdown4() {
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown4');
    sub_menu_dropdown.setAttribute("style", "transition: .2s; opacity:1; display:block; left: 10%;");
    console.log("OpenDropdown() start");
}

function CloseDropdown4() {
    let sub_menu_dropdown = document.getElementById('sub_menu_dropdown4');
    sub_menu_dropdown.setAttribute("style", "transition: .5s; delay-transition:1s; display:none; left:auto; right: " + widthDropdown1 + "px;");
}

function SearchShow() {
    console.log("SearchShow() on");
    document.getElementById('search_key').setAttribute("style", "position: fixed; display: block; font-size: 20px !important; border-radius: 5px; top: 68px; height: 50px; width: 92%; left: 4%; text-indent: 1%; background: #e8e8e8; z-index: 10");
}

function SearchButtonOff() {
    console.log("SearchButtonOff() on");
    document.getElementById('search_key').setAttribute("style", "display: none");
}

function OpenMenu() {
    if(stateMenu == "close") {
        console.log("OpenMenu() on");
        document.getElementById('btnCloseMenuNav').setAttribute("style", "display: block");
        document.getElementById('sub_menu_nav').classList.add("open-menu");
        document.getElementById('hamb2').setAttribute("style", "display: none;");
        document.getElementById('hamb1').setAttribute("style", "transition: 0.5s; transform: rotate(-45deg); top: 17px;");
        document.getElementById('hamb3').setAttribute("style", "transition: 0.5s; transform: rotate(45deg); top: 14px;");
        stateMenu = "open";
    } else { CloseMenu(); }
}

function CloseMenu() {
    console.log("CloseMenu() on"); // btnCloseMenuNav
    document.getElementById('btnCloseMenuNav').setAttribute("style", "display: none");
    document.getElementById('sub_menu_nav').classList.remove("open-menu");
    document.getElementById('hamb2').setAttribute("style", "display: block");
    document.getElementById('hamb1').setAttribute("style", "transition: 0.5s; transform: rotate(0deg); top: 13px;");
    document.getElementById('hamb3').setAttribute("style", "transition: 0.5s; transform: rotate(0deg); top: 25px;");
    stateMenu = "close";
}