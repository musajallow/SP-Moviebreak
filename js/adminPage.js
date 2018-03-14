//SEARCH FUNCTION Starts. Denna fungerar inte om man lägger den innom document ready. Det kan bero på att den inte helt är gjord med jQuery.

    function searchMovie() {

        $("#searchResult").html(""); //Hittar diven där funktionen ska ligga. "" gör att htmln töms innan varje gång den körs.

        var searchInput = document.getElementById("searchInputField"); 

        var searchUrl = "http://medieinstitutet-wie-products.azurewebsites.net/api/search?searchText=";

        var resultUrl = searchUrl + searchInput.value; //urlen för apiet plus det anvandaren har skrivit in i input fältet blir sökresultatet. 



        $.getJSON( resultUrl, function( data ) {

            var items = []; //En tom lista skapas

            $.each( data, function( index, val ) { //Loopar igenom sökresultatet och skriver ut filmerna och egenskaperna som vi vill visa. 
                items.push("<li>" 
                    + "<a href='productPage.html?movie=" + val.id + "'>" 
                    + "<img src= '" + val.imageUrl + "' >"
                    + "<span class='stext'>" + val.name + "</span>"
                    + "</a>"
                    + "</li>");
                    });

                    $( "<ul/>", { "class": "my-new-list", html: items.join( "" )})
                .appendTo($("#searchResult")); //Egenskaperna pushas in i en lista och sedan omsluts av en ul som får en class och läggs i spanet med id searchResult. Join skapar en sträng. 
            });
    }
    //SEARCH FUNCTION ends

$(document).ready(function () {

    //Anropa ajax för kund beställningar
    $.ajax({
        url: 'http://medieinstitutet-wie-products.azurewebsites.net/api/orders?companyId=77',
        dataType:"json", //Här gör vi beställning sträng till Json objekt 
    
        success: function(data){ 
    //Om succé, konsollog datan som är kundbeställningar
        console.log(data);
        var lengths = data.length;
        var txt = "";

    //Om kund beställning sträng längd är inte null, då kör loopen att skapa en text
    if(lengths != null){
                    
    for(var i=0;i<lengths;i++){
                 
    //Här skapar vi en tabell row med tabell data som visar egenskaper till kundbeställningarna
                            txt += "<tr class='bird'><td>Antal beställda filmer: "+data[i].orderRows.length+"</td>";
                            txt+= "<td>"+data[i].createdBy+"</td>";
                            txt+= "<td>"+data[i].totalPrice+"</td>";
                            txt+= "<td>"+data[i].paymentMethod+"</td>";
                          
                            txt+= "<td>"+data[i].created+"</td>";
    
    //Här körs en till loop för varsin beställning/film
    for (var j= 0; j < data[i].orderRows.length; j++){ 
   
    //Anropa ajax url som har produktId av valda filmer           
                   $.ajax({
                        url: "http://medieinstitutet-wie-products.azurewebsites.net/api/products/" + data[i].orderRows[j].productId,
                        dataType: "json",
                       
    //Async false betyder att man borde vänta tills konden läses innan man fortsätter
                        async: false,
                       
    //Om succé att anropa ajax, sparar vi detta i en variabel "product"
                        success: function(product) {
//    Här lägger vi till en till tabell row som innehåller alla individa beställningar och dess namn i en lista       
                            txt += "<tr class='butterfly'><td>" + product.name + "</td></tr>";
                        }
                    }); //Här stängs Ajax anrop

                    }//Här stängs loopen
                    
//Här stängs table row
                         txt+= "</tr>"; 
                       
                }
        //Om tabellen är inte tom, lägg i alla txt till tabellen och ta bort klassen hidden 
         if(txt != ""){
                        $("#table").append(txt).removeClass("hidden");
                    }
            }
            
      
}})})



