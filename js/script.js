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
                a) set the header
                    1) form the row (in the cycle)
                    2) draw the row
                b) set the body
                    1) form the row (in the cycle)
                    2) draw the row
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
            return !(item.code() == params['code']);
        });

    }

    function resetFilter() {
        $('.drop-down-list .menu').remove();
        $('.structure__body input[type="radio"]').prop('checked', false);
        $('.measurements__body input[type="radio"]').prop('checked', false);
        fields = [];
        measures = undefined;
        list = [];

    }

    // 2. gathering adjusted params & build ajax query
    function gatherParams() {

        // b) form the model
        var data = {
            'measurements': -1,
            'row': [],
            'header': []
        };

        // a) get data from frontend
        data['measurements'] = measures.value();

        fields.forEach(function (item) {
            var tmpVal = item.value(),
                tmpCode = item.code();

            if (tmpVal != undefined) {
                // get selected data from each field
                var tmpList = list.filter(function (element) {
                    return (element.code() == tmpCode);
                });
                var tmpData = tmpList[0].values();

                data[tmpVal].push({
                    code: tmpCode,
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
                data: data
            })
            .done(function (response) {
                if (response['status'] == 'ok') {
                    //  3. cube drawing
                    cubeDraw(response['data']);

                } else {
                    // internal error
                }
            })
            .fail(function (error) {
                console.log(error);
            })
    }

    function cubeDraw(data) {
        var cube = $('.cube-table').empty(),
            head = $('<thead/>', {
                class: 'cube-head'
            }),
            body = $('<tbody/>', {
                class: 'cube-body'
            });


        //  a) set header
        $(head)
            .append($('<tr/>')
                .append($('<th/>', {
                    colspan: data['header']['columns'].length
                }))
                .append($('<th/>', {
                    colspan: data['header']['head']['data'].length,
                    text: data['header']['head']['name']
                })));

        var names = $('<tr/>', {
            class: 'cube-head-names'
        });

        (data['header']['columns']).forEach(function (element) {
            $(names).append($('<th/>', {
                text: element
            }))
        }, this);

        (data['header']['head']['data']).forEach(function (element) {
            $(names).append($('<th/>', {
                text: element
            }))
        }, this);

        $(head).append($(names));

        //   b) set the body

        (data['rows']).forEach(function (row) {
            var values = $('<tr/>');

            (row['columns']).forEach(function (element) {
                $(values).append($('<th/>', {
                    text: element
                }))
            }, this);

            (row['data']).forEach(function (element) {
                $(values).append($('<td/>', {
                    text: element
                }))
            }, this);
            $(body).append($(values));
        }, this);


        $(cube).append($(head)).append($(body));

    }