$(function () {
    var request = [];
    var output = [];
    var listItem = $('.text-list').html();

    //開始ボタン
    $('#btn').on('click', function () {
        $('button, input').prop("disabled", true); //ボタン非活性
        $('#results').empty();
        valSet();
        ajax();
    });

    //入力欄クリアボタン
    $('#clearBtn').on('click', function () {
        $('.text-list').find('input').val('');
    });

    //入力欄追加
    $('#plusBtn').on('click', function () {
        $('.text-list').append(listItem);
    });

    //入力欄削除
    $('#minusBtn').on('click', function () {
        $('.text-list li:last-child').remove();
    });

    //inputの値を取得
    function valSet() {
        var input = $('.text-list').find('input');

        $('input').each(function (index, element) {
            var indexVar = $('.text-list').find('input').eq(index).val();
            var desktop = index * 2;
            var mobile = desktop + 1;
            request[desktop] = {
                url: indexVar,
                strategy: 'desktop',
            };
            request[mobile] = {
                url: indexVar,
                strategy: 'mobile',
            };
        });
    };

    //for分処理
    function ajax() {
        var requestIndex = request.length - 1;
        var count = 0;
        output = [];

        $.each(request, function (index, val) {
            $.ajax({
                type: 'GET',
                url: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
                dataType: 'json',
                data: {
                    // エリアidを送る
                    url: val.url,
                    category: 'performance',
                    strategy: val.strategy,
                    key: 'AIzaSyDlOhtXh1O6SebtJzQN-Vq8OKmlNLylV2Y'
                }
            }).done(function (data) {
                console.log("成功");

                create_output_data(data, index);
                output_list(count, requestIndex, output);
                count++;
            }).fail(function (err) {
                console.log("失敗");

                output[index] = ('<li>失敗しました</li>');
                output_list(count, requestIndex, output);
                count++;
            });
        });
    };

    function output_list(count, requestIndex, output) {
        if (count >= requestIndex) {
            $.each(output, function (index) {
                $('#results').append(output[index]);
            });
            $('button, input').prop("disabled", false);
        }
    };

    function create_output_data(data, index) {
        var searchUrl = data.id; //URL
        var searchDevice = data.lighthouseResult.configSettings.emulatedFormFactor; //PC or SP
        var searchScore = Math.round(data.lighthouseResult.categories.performance.score * 100) + '%'; //スコアの値
        output[index] = (
            '<li>' +
            '<p>URL = ' + searchUrl + '</p>' +
            '<p>デバイス = ' + searchDevice + '</p>' +
            '<p>スコア = ' + searchScore + '</p>' +
            '</li>'
        );
    };
});