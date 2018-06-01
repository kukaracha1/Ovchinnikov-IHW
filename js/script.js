    var fields = [],
        measures, list = [];


    $(function () {
        /*
            1. params drawing
                a) get fields from get_rows
                b) draw it (structureSet & measurements)
                c) get data from field, when it choosed
                d) draw data (drop-down-list)
                e) fill the 'reset' button
            2. gathering adjusted params & build ajax query
                a) get data from frontend
                b) form the model
                c) send ajax
            3. cube drawing
        */

        //  1. params drawing
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
                        fields[i] = new StructureSet(item, '.structure__body');
                        fields[i].onCheck(addToDDList);
                        fields[i].onUncheck(removeFromDDList);
                    }
                    // for (var i = 0; i < response['measures'].length; i++) {
                    // var item = response['measures'][i];
                    measures = new Measurements(response['measures'], '.measurements__body');
                    // measures[i].append('.measurements__body');
                    // }
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
                    list.push(new DropDownList(params, '.drop-down-list'));
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

        list = list.filter(function (item) {
            return !(item['id'] == params['id']);
        });

    }

    function resetFilter() {
        $('.drop-down-list .menu').remove();
        $('.structure__body input[type="radio"]').prop('checked', false);
        $('.measurements__body input[type="radio"]').prop('checked', false);
    }

    // 2. gathering adjusted params & build ajax query
    function gatherParams() {

        // b) form the model
        var data = {
            'measurements': [],
            'row': [],
            'header': []
        };

        // a) get data from frontend
        data['measurements'] = measures.value();

        fields.forEach(function (item) {
            var tmpVal = item.value(),
                tmpId = item.id();

            if (tmpVal != undefined) {
                // get selected data from each field
                var tmpList = list.filter(function (element) {
                    return !(element.id() == tmpId);
                });
                var tmpData = tmpList[0].values();

                data[tmpVal].push({
                    id: tmpId,
                    data: tmpData
                });

            }
        }, this);

        console.log(data);

        // c) send ajax
        $.ajax({
                url: 'backend/cube/claims.json',
                dataType: 'json',
                method: 'GET',
            })
            .done(function (response) {
                if (response['status'] == 'ok') {
                    //  3. cube drawing


                } else {
                    // internal error
                }
            })
            .fail(function (error) {
                console.log(error);
            })
    }