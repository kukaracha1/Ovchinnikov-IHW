$(function () {
    /*
        1. params drawing
            a) get fields from get_rows
            b) draw it (structureSet & measurements)
            c) get data from field, when it choosed
            d) draw data (drop-down-list)
            e) fill the 'reset' button
        2. gathering adjusted params & build ajax query
        3. cube drawing
    */

    var fields;
    
    //  a) get fields from get_rows
    $.ajax({
            url: '../backend/data/get_rows.json',
            dataType: 'json',
            method: 'GET',
        })
        .done(function (response) {
            console.log('Everything is allright');
            console.log(response);
            if(response['status'] == 'ok')
            {
                fields = [];
                // okok. draw data
                //  b) draw it (structureSet & measurements)
                response['data'].forEach(function(element) {
                    fields[] = new structureSet(element);

                }, this);

                fields.forEach(function(element) {
                    element.append();
                }, this);
            }
            else
            {
                // internal error
            }
        })
        .fail(function (error) {
            console.log('Error');
            console.log(error);
        })
})