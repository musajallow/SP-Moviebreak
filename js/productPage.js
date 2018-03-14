//SEARCH FUNCTION Starts
    function searchMovie() {

        $("#searchResult").html("");

        var searchInput = document.getElementById("searchInputField"); //$("#searchInputField");

        var searchUrl = "http://medieinstitutet-wie-products.azurewebsites.net/api/search?searchText=";

        var resultUrl = searchUrl + searchInput.value;

        //console.log(resultUrl);



        $.getJSON( resultUrl, function( data ) {
            //console.log(data);

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


$(document).ready(function () {
    
    badge();
    
    function getParameterByName( name, url ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
};
    
 var selectedMovieId = getParameterByName("movie"); // vald film skapas med url i variablen selectedMovieId
    
 $.getJSON("http://medieinstitutet-wie-products.azurewebsites.net/api/products", function (moviesData) {
     console.log(moviesData); // två getjSONanrop, en för producterna och en för kategorierna

     $.getJSON("http://medieinstitutet-wie-products.azurewebsites.net/api/categories", function (categories) { 

         console.log(categories);


         /*function createAllDiv() {*/
         for (var i = 0; i < moviesData.length; i++) { // loopar igenom produkterna 
             if (selectedMovieId == moviesData[i].id) { // OM användarens valda film har samma id som en film i produktlistan, skapa en container och struktur för produktsidan

                 var secondContainer = $("<div>")
                     .addClass("secondContainer")
                     .insertBefore("#footerId");

                 var imgDiv = $("<div>")
                     .addClass("col-md-5")
                     .attr("id", "imgDivId")
                     .appendTo(secondContainer);


                 $("<img>")
                     .attr("src", moviesData[i].imageUrl)
                     .addClass("filmImgSelected")
                     .appendTo(imgDiv);

                 var thirdContainer = $("<div>")
                     .addClass("col-md-7")
                     .attr("id", "thirdContainer")
                     .appendTo(secondContainer);

                 $("<div>")
                     .attr("id", "filmTitleDiv")
                     .addClass("col-md-12")
                     .appendTo(thirdContainer);

                 $("<span>")
                     .addClass("filmTitleSpan")
                     .text(moviesData[i].name)
                     .appendTo("#filmTitleDiv");


                 $("<div>")
                     .attr("id", "genreGenre")
                     .addClass("col-md-12")
                     .appendTo(thirdContainer);

                 for (var j = 0; j < categories.length; j++) { // loopa igenom kategorierna
                     for (var k = 0; k < moviesData[i].productCategory.length; k++) { // loopar igenom filmens produktkategori 
                         if (moviesData[i].productCategory[k].categoryId == categories[j].id) //OM kategoriId i produktkategorin är samma den valda filmens kategoriId så skapa ett span som innehåller filmens kategori

                             $("<span>")
                                 .addClass("filmGenreSpan")
                                 .text(categories[j].name)
                                 .appendTo("#genreGenre");
                     }
                 }

                 $("<span>")
                     .addClass("filmYearSpan")
                     .text(moviesData[i].year)
                     .appendTo("#genreGenre");

                 $("<div>")
                     .attr("id", "movieInfo")
                     .addClass("col-md-12")
                     .appendTo(thirdContainer);

                 $("<span>")
                     .addClass("filmDescriptionSpan")
                     .text(moviesData[i].description)
                     .appendTo("#movieInfo");

                 $("<div>")
                     .attr("id", "buy")
                     .addClass("col-md-12")
                     .appendTo(thirdContainer);


                 $("<button>") // skapade knappar med tillhörande pris
                     .attr({ id: moviesData[i].id, type: "button" })
                     .text("Köp för " + moviesData[i].price + " kr")
                     .addClass("buyMovie")
                     .appendTo("#buy");

                 $("<button>")
                     .attr({ id: moviesData[i].id, type: "button" })
                     .text("Lägg i kundkorg")
                     .addClass("addMovie")
                     .appendTo("#buy");

                 $("<div>")
                     .attr("id", "toggleSpan")
                     .addClass("col-md-12")
                     .appendTo(thirdContainer);

                 $("<span>")
                     .addClass("confirmAddedMovie")
                     .text("Nu finns " + moviesData[i].name + " i din varukorg")
                     .appendTo("#toggleSpan");

                 $(".buyMovie").click(function () {

                     var ordersFromLs = [];

                     var foundMovie = false; // sålänge foundMovie är false,

                     if (localStorage.getItem("orders") != null) { // "hämtar" listan 
                         ordersFromLs = JSON.parse(localStorage.getItem("orders"));
                     }

                     for (var i = 0; i < ordersFromLs.length; i++) {
                             if (ordersFromLs[i].ProductId == $(this).attr("id")) {
                                 foundMovie = true;
                                 break;
                             }
                         }
                     if (foundMovie == false) {
                         console.log($(this).attr("id"));
                         ordersFromLs.push({ ProductId: $(this).attr("id"), Amount: 1 });

                         localStorage.setItem("orders", JSON.stringify(ordersFromLs));
                     }
                     location.href = "cartPage.html";
                     badge();
                 });

                 $(".addMovie").click(function () {

                     var ordersFromLs = [];

                     var foundMovie = false;

                     if (localStorage.getItem("orders") != null || null) {
                         ordersFromLs = JSON.parse(localStorage.getItem("orders"));
                     }

                     for (var i = 0; i < ordersFromLs.length; i++) {
                         if (ordersFromLs[i].ProductId == $(this).attr("id")) {
                             foundMovie = true;
                             break;
                         }
                     }
                     if (foundMovie == false) {
                         console.log($(this).attr("id"));
                         ordersFromLs.push({ ProductId: $(this).attr("id"), Amount: 1 });

                         localStorage.setItem("orders", JSON.stringify(ordersFromLs));
                         
                     }
                   
                     $(".badge").text(ordersFromLs.length);
                 });

                 $(".addMovie").click(toggleIt);
                 badge();

                 function toggleIt() {
                     $(".confirmAddedMovie").fadeIn("slow", "linear");
                     setTimeout(function () {
                         $(".confirmAddedMovie").fadeOut();
                     }, 2500);
                 }
             }
         }

     })
 })
    
    function badge() {
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
})
