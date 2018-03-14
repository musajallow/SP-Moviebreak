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
    
    badge();
    
//    var orders = JSON.parse(localStorage.getItem("orders"));
//    $(".badge").text(orders.length);
//    console.log(orders.length);
    
//Här hämtar vi de två api:erna, products och categories. De lagras i variablerna moviesData och categories. 
    $.getJSON("http://medieinstitutet-wie-products.azurewebsites.net/api/products", function (moviesData) {
        $.getJSON("http://medieinstitutet-wie-products.azurewebsites.net/api/categories", function (categories) {

            $(categories).each(function (index, category) { //Loopar igenom category i apiet catigories. Nedan skapar vi upp html-struktur för startsidan.

                var categoryContainer = $("<div>")
                    .attr("class", "categoryOverallContainer")
                    .appendTo("#entireBodyDivId");

                $("<div>")
                    .attr("class", "spanInCategoryOverallContainer")
                    .html(category.name)
                    .appendTo(categoryContainer);

                var moviesContainerPerCategory = $("<div>")
                    .attr("class", "productsInCategoryOverallContainer")
                    .appendTo(categoryContainer);


                // Skapar upp divar för karusellerna här nedan

                var carouselSlide = $("<div>")
                    .attr("id", "genreCategory_" + category.id)
                    .attr("class", "carousel")
                    .addClass("slide")
                    .attr("data-ride", "carousel")
                    .attr("data-interval", "false") //stoppar autoplay av karusellen
                    .appendTo(moviesContainerPerCategory);

                var carouselInner = $("<div>")
                    .addClass("carousel-inner")
                    .appendTo(carouselSlide);

                var controlPrev = $("<a>") //div för vänsterpil
                    .addClass("left carousel-control")
                    .attr("href", "#genreCategory_" + category.id)
                    .attr("data-slide", "prev")
                    .appendTo(carouselSlide);

                $("<span>")
                    .addClass("glyphicon glyphicon-chevron-left")
                    .appendTo(controlPrev);

                var controlNext = $("<a>") //div för högerpil
                    .addClass("right carousel-control")
                    .attr("href", "#genreCategory_" + category.id)
                    .attr("data-slide", "next")
                    .appendTo(carouselSlide);

                $("<span>")
                    .addClass("glyphicon glyphicon-chevron-right")
                    .appendTo(controlNext);

                for (var i = 0; i < moviesData.length; i++) { //Nu loopsr vi igenom listan med produkterna dvs moviesData. 
                    if (i == 0) { //Den sliden som visas är den som är item active. Alltså den första i listan. 
                        var item = $("<div>") 
                            .addClass("item active")
                            .appendTo(carouselInner);
                        
                    }
                    else { // Annars så blir klassen bara item. Alltså de som inte visas just nu.
                        var item = $("<div>")
                            .addClass("item")
                            .appendTo(carouselInner);
                    }


                    for (var j = 0; j < 5; j++) { //Antal bilder som ska visas per slide i karusellen definieras. 
                        if (moviesData.length > i) { //En jämförelse för att begränsa antalet filmer som visas per slide.
                            var addThisMovie = false;
                            
                            for (var k = 0; k < moviesData[i].productCategory.length; k++) { // loop för att ta fram vilka filmenr som ska visas i varje kategorikarusell.
                                if (moviesData[i].productCategory[k].categoryId == category.id) { //Om film och karusell har samma genre så ska filmen läggas till i karusellen. 
                                    addThisMovie = true;
                                }
                            }

                            if (addThisMovie == true) { //Produkten skrivs ut med bild och läggs till i variabln item.
                                var img = $("<img>")
                                    .addClass("imgClass")
                                    .attr("id", moviesData[i].id)
                                    .attr("src", moviesData[i].imageUrl)
                                    .appendTo(item);
                                
                                var moviePrice = $("<span>") //Produktens pris skrivs ut och läggs till i variabln item.
                                    .addClass("moviePrice")
                                    .html(moviesData[i].price)
                                    .appendTo(item);
                                
                            }
                            else {
                                j--; // Förhindrar att en film tar upp en plats i karusellen om den inte tillhör den valda kategorin.
                            }
                            
                        }

                        i++;
                        $("img.imgClass").on("click", function () { //Redirectar varje film till sin product page. 
                                window.location.href = "productPage.html?movie=" + this.id; });
                                   
                                   
                                };
                    
                    }
                    
                })

//                $('#genreCategory_' + categories.id).carousel({
//                    interval: false
//                });
                
                
            })
        })
    
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




       