function getParameterByName(name, url) {
   if (!url) url = window.location.href;
   name = name.replace(/[[]]/g, "\$&");
   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
       results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/+/g, " "));
}


$(document).ready(function () {
    badge();

var orders = JSON.parse(localStorage.getItem("orders")); // Hämtar ordrar från Local Storage
    
//    $(".badge").text(orders.length);
//    console.log(orders.length);
    
    var totalPrice = JSON.parse(localStorage.getItem("TotalSum")); // Hämtar totala priset från Local Storage

function getDateTime() { // Funktion för att hämta tiden då beställningen är gjord för att presentera i admin page. 
        var dateTime = new Date();
        dateTime.setHours(dateTime.getHours()+1);
        return dateTime;
    }
 
    
    $.getJSON("http://medieinstitutet-wie-products.azurewebsites.net/api/products", function (moviesData) { //Hämtar apiet för produkterna
        
    for (var s = 0; s < orders.length; s++){ //Loopar igenom ordrarna från Local Storage
        
        for (var t = 0; t < moviesData.length; t++){ // Loopar igenom produkterna från apiet
        
    if (orders[s].ProductId == moviesData[t].id){ //Jämför produkter i moviesData med orders för att se vilka produkter som är beställda. De som matchar skrivs ut med namn och pris, visas nedan. 
        
       var titlePrice = $("<li>")
                    .addClass("spanClass1")
                    .text(moviesData[t].name + " - " + moviesData[t].price + " kr")
                    .appendTo("#payNow");  
        
        
    }}};
        
        var titlePrice = $("<span>")
                    .addClass("spanClass1")
                    .text("Totalt: " + totalPrice + " kr")
                    .appendTo("#sumNow"); 
        

    });      
    
    
    $("#buttonBuy").on("click", ValidateButton); // Knapp som avgör om formuläret är rätt ifyllt för att skicka infon till servern. 
    
function ValidateButton() { //Validering av formulär

        var firstName5 = document.getElementById("resultOfFirstName").value;

        var lastName5 = document.getElementById("lastName").value;

        var phoneNumber5 = document.getElementById("resultOfPhoneNumber").value;

        var email5 = document.getElementById("resultOfEmailAddress").value;

        var radioButton5 = $("input:radio[name ='example']:checked").val();


      var emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; //Här kommer regular expressions för validering
        var phoneno = /^\d{10}$/;


if( firstName5 ==='' || lastName5 ==='' || phoneNumber5 ==='' || email5 ===''){ // tre = tecken betyder att det är superstrikt att det är så.
        alert("Fyll i alla obligatoriska fält.");
        return false;
    }

else if(!(email5).match(emailReg)){
    
        alert("Ange rätt email.");
        return false;
    }
    
else if (!(phoneNumber5).match(phoneno))
        {
        alert("Ange rätt telefon nummer.");
        return false;
        }
    
else 
{   $("#buttonBuy").on("click", sendApiToSebastian); // Om allt är rätt ifyllt så ska informationen skickas till Sebastians server. 
        }
 

function sendApiToSebastian() { // Funktion för att skicka fromulärinformationen till till server.
    var sendSebastionHisApi = { // Informationen i form av lista som vi skickar till Sebastians server. 
      CompanyId: 77,
      Created: getDateTime(),
      CreatedBy: email5,
      TotalPrice: totalPrice,
      Status: 1,
      PaymentMethod: radioButton5,
      OrderRows: [] // En lista i listan
    };

    for (var i = 0; i < orders.length; i++) { //Loopar igenom ordrarna för att kunna pusha in ProductId och Amount i OrderRows. 
      sendSebastionHisApi.OrderRows.push({
        ProductId: orders[i].ProductId,
        Amount: orders[i].Amount
      });
    }
    return sendSebastionHisApi; // Stoppar funktionen och returnerar värdet av variabeln sendSebastionHisApi.
  }
    
$.ajax({ //Vi skickar iväg vår lista servern.
        method: "POST",
        url: "https://medieinstitutet-wie-products.azurewebsites.net/api/orders",
        data: JSON.stringify(sendApiToSebastian()),
        contentType: "application/json; charset=utf-8",
        headers: {
          accept: "application/json"
        },
        success: function(result) { // Vid success rensas Local Storage och visar upp modalen. 
            
          $("#myModal").modal("show");
          localStorage.removeItem(orders);            

        },
        error: function(error) {
        alert("Försök igen!"); // Vid fel så kommer ett felmeddelande i en alert
        }
      })
    }
    
    function badge () {
         var order = JSON.parse(localStorage.getItem("orders"));
        
        if(order == null){
            order = [];
        }
        
        var badgeCount = [];
        
        for(var i =0; i < order.length; i++){
            badgeCount.push(order[i].amount);
        }
        
        var summery = badgeCount.reduce(function(a,b){
            return a + b;
            
        }, 0); //Gör att det alltid står noll när det är noll filmer i. 
        
    $(".badge").attr("data-count", summery);
    }
    
});


//SEARCH FUNCTION Starts
    function searchMovie() {

        $("#searchResult").html("");

        var searchInput = document.getElementById("searchInputField"); //$("#searchInputField");

        var searchUrl = "http://medieinstitutet-wie-products.azurewebsites.net/api/search?searchText=";

        var resultUrl = searchUrl + searchInput.value;




        $.getJSON( resultUrl, function( data ) {

            var items = [];

            $.each( data, function( index, val ) {
                items.push("<li>" 
                    + "<a href='productPage.html?movie=" + val.id + "'>" 
                    + "<img src= '" + val.imageUrl + "' >"
                    + "<span class='stext'>" + val.name + "</span>"
                    + "</a>"
                    + "</li>");
                    });

                    $( "<ul/>", { "class": "my-new-list", html: items.join( "" )})
                .appendTo($("#searchResult"));
            });
    }
    //SEARCH FUNCTION ends