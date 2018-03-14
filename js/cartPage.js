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

    var testCart = JSON.parse(localStorage.getItem("orders"));
    
//    $(".badge").text(testCart.length);
//    console.log(testCart.length);


    $("#saveAndSend").on("click", function () {

        localStorage.setItem("customerOrder", "")

        location.href = "paymentPage.html";
    });

    getSummary(testCart);

    $(testCart).each(function (index, currentMovie) {
        

        $.getJSON("http://medieinstitutet-wie-products.azurewebsites.net/api/products/" + currentMovie.ProductId, function (movies) {



            var chosenMovie = $("<div>")
                .addClass("col-md-12")
                .addClass("productRow")
                .attr("id", movies.id)
                .appendTo("#movieContainer");

            var moviePicture = $("<div>")
                .attr("id", "moviePicture")
                .addClass("col-md-2")
                .appendTo(chosenMovie);

            var img = $("<img>")
                .addClass("imgClass", "col-md-12")
                .attr("id", movies.id)
                .attr("src", movies.imageUrl)
                .appendTo(moviePicture);

            var movieInfo = $("<div>")
                .attr("id", "movieInfo")
                .addClass("col-md-8")
                .appendTo(chosenMovie);

            var movieInfoList = "<ul>" +
                "<li>" + movies.name + "</li>" +
                "<li>" + movies.year + "</li>" +
                "<li>" + movies.price + " kr" + "</li>" +
                "<li>" + movies.description + "</li>" +
                "</ul>";

            var chosenMovieInfo = $("<span>")
                .attr("id", "chosenMovieInfo")
                .addClass("col-md-12")
                .html(movieInfoList)
                .appendTo(movieInfo);

            var removeMovie = $("<div>")
                .attr("id", "wasteBasket")
                .addClass("col-md-2")
                .appendTo(chosenMovie);

            var removeButton = $("<span>")
                .addClass("glyphicon glyphicon-trash", "col-md-12")
                .attr("id", movies.id)
                .appendTo(removeMovie);

            $(".glyphicon-trash").click(function () {
                console.log("hej")
                var index = -1;
                var testCart = JSON.parse(localStorage.getItem("orders")) || {};
                for (var i = 0; i < testCart.length; i++) {

                    if (testCart[i].ProductId == $(this).attr("id")) {
                        testCart.splice(i, 1);
                        $(this).parent().parent().remove();
                        break;
                    }
                    console.log(testCart);
                }
                localStorage.setItem("orders", JSON.stringify(testCart));
                getSummary(testCart);
            });
        });
    });
    


    function getSummary(testCart) {
        var sum = 0;
        
        $(testCart).each(function (index, eachMovie) {
            $.ajax({
                url: "http://medieinstitutet-wie-products.azurewebsites.net/api/products/" + eachMovie.ProductId, dataType: "json",
                async: false,

                success: function (movies) {

                    console.log(eachMovie);
                    console.log(movies.price);
                    sum += (eachMovie.Amount * movies.price);
                    console.log(sum);

                    $("#showSum").text(" " + sum + " kr");
                }
            });
            
            localStorage.setItem("TotalSum", JSON.stringify(sum));

        });

    };
    
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
