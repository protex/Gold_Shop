

        /*
        * function initProfile
        * purpose: create the box for the profile that items will be displayed on, and add it to the page
        * variabls: None
        */
        initProfile: function () {

            // Create the html for the display
            /*
            * html node list
            * div: class = [content-box, center-col]
            * -table: id = shop-items
            * --table body
            * ---table row
            * ----table column
            * -----font: size = 6 (can be changed by user) contents: the words "items"
            * ---table row
            * ----table column: id = "shelf"
            */
            var html = '';
                html += '<div class="content-box center-col">';
                html += '<table id="shop-items">';
                html += '<tbody>';
                html += '<tr>';
                html += '<td style="text-align: center"><font size="6">Items</font></td>';
                html += '</tr>';
                html += '<tr>';
                html += '<td id="shelf"></td>';
                html += '</tr>';
                html += '</tbody>';
                html += '</table>';
                html += '</div>';

            // Append it to the correct spot
            $( '.content-box:last' ).prev().after( html );

            // Call the shelveItems function so the items will be added
            this.shelveItems();

        },