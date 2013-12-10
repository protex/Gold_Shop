

        createShelf: function ( title, id ) {

            // Create the html of the shelve
            // The html consists of:
            /*
            * container with a class of category plus the supplied title
            * -title bar with the title of the category
            * -the main area
            * --the table with all the items in it
            * ---the head
            * ----item head
            * ----description head
            * ----cost head
            * ----available head
            * ----id head
            * ----buy head
            * ----return head
            * ---the body (id of the body is the id supplied)
            */
            var html = "";
            html += '<div class="container category-' + title +'">';
            html += '<div class="title-bar"><h1>' + title + '</h1></div>';
            html += '<div class="content cap-bottom">';
            html += '<table width="100%">';
            html += '<thead>';
            html += '<tr><th style="width: 200px;">Item</th><th>Description</th><th style="width: 5%">Cost</th><th style="width: 10%">Available</th><th style="width: 5%">ID</th><th style="width: 5%">Buy</th><th style="width: 8%">Return</th></tr>';
            html += '</thead>';
            html += '<tbody id="' + id + '">';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';

            // Return the created element
            return $( html );

        },