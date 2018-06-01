    var fields, measures, list;


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

        getFields();

        $('.filter-reset').click(function (e) {
            e.preventDefault();
            resetFilter();
        })
        $('.data-send').click(function (e) {
            e.preventDefault();
            gatherParams();
        })

    })

    //  a) get fields from get_rows
    function getFields() {
        $.ajax({
                url: 'backend/data/get_rows.json',
                dataType: 'json',
                method: 'GET',
            })
            .done(function (response) {
                if (response['status'] == 'ok') {
                    fields = [];
                    measures = [];
                    // okok. draw data
                    //  b) draw it (structureSet & measurements)
                    for (var i = 0; i < response['data'].length; i++) {
                        var item = response['data'][i];
                        fields[i] = new StructureSet(item);
                        fields[i].append('.structure__body');
                        fields[i].onCheck(addToDDList);
                        fields[i].onUncheck(removeFromDDList);
                    }
                    for (var i = 0; i < response['measures'].length; i++) {
                        var item = response['measures'][i];
                        measures[i] = new Measurements(item);
                        measures[i].append('.measurements__body');
                    }
                } else {
                    // internal error
                }
            })
            .fail(function (error) {
                console.log(error);

            })
    }

    //c) get data from field, when it choosed
    function addToDDList(params) {
        var code = params['code'];

        $.ajax({
                url: 'backend/data/' + code + '.json',
                dataType: 'json',
                method: 'GET',
            })
            .done(function (response) {
                if (response['status'] == 'ok') {
                    params['data'] = response['data'];
                    // okok. draw data
                    //  d) draw data (drop-down-list)
                    var list = new DropDownList(params);
                    list.append('.drop-down-list');
                } else {
                    // internal error
                }
            })
            .fail(function (error) {
                console.log(error);
            })
    }

    function removeFromDDList(params) {

        $('.drop-down-list #' + params['code'] + '.menu').remove();
    }

    function resetFilter() {
        $('.drop-down-list .menu').remove();
        $('.structure__body input[type="radio"]').prop('checked', false);
        $('.measurements__body input[type="radio"]').prop('checked', false);
    }

    function gatherParams() {
        console.log(
            $('.drop-down-list .menu input[type="checkbox"]:checked')
        );
        console.log(

            $('.measurements__body input[type="radio"]:checked').val()
        );
        console.log(

            $('.structure__body input[type="radio"]:checked')
        );
    }