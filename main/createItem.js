

        createItem: function ( name, image, description, cost, id, returnable ) {

            var html = '';
            html += '<tr class="item">';
            html += '<td title="' + name + '" class="picture"><img style="max-width: 200px; max-hieght: 200px; display:block; margin-left: auto; margin-right: auto;" src="' + image + '" /></td>';
            html += '<td class="description" style="text-align: center">' + description + '</td>';
            html += '<td style="text-align: center;" class="cost">' + cost + '</td>';
            html += '<td style="text-align: center;" class="available" id="available-' + id +'">' + vitals.shop.recount( id ) + '</td>';
            html += '<td style="text-align: center;" class="id">' + id + '</td>';
            html += '<td><a href="javascript:vitals.shop.officialBuyItem(\'' + id + '\')" role="button" class="button">Buy</a></td>';
            html += ( returnable == "true" )? '<td><a href="javascript:vitals.shop.officialReturnItem(\'' + id + '\')" role="button" class="button">Return</a></td>' : '<td><a href="javascript:void(0)" style="background-color: red;" role="button" class="button">Return</a></td>';
            html += '</tr>';

            return $( html );

        },
