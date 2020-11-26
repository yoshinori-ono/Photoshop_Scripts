/**
 * position_exort.jsx

 *感謝
 *https://ishiotks.hatenablog.com/entry/2019/02/02/143259
 * generator_png_layer_listup.jsx
 */

// 処理に該当する拡張子名の配列
//// 今回は png のみなので .png
//var extensions = [".png"];
var extensions = ["_pos"];
// 書き出す際のテキストを貯める変数
var strData = "";

// 以下処理 ///////////////////////////////////////////////////////
if( app.documents.length == 0 ){
    alert( "【！】実行するドキュメントがありません。" );
} else {
    main();
}

function main(){
    if(confirm( activeDocument.name + "から、pngのつくレイヤーから矩形抽出しますか？" )){
        section();
    }
    alert( "すべての処理が完了しました。お疲れ様でした。" );
    return "完了";
}

function section(){

    // ファイルを作成し、テキストレイヤー書き出し処理へ
    var fileName = activeDocument.fullName + "_export.csv";
    var file = new File(fileName);
    var openFlag = file.open("w");

    strData += activeDocument.name + ",";

    if(openFlag) {
        // 再帰的に処理
        allLayerSetsBounds( activeDocument );
        // CSVテキストの出力
        file.write(strData);
        file.close();
        // 完了
        alert("書き出しが完了しました。");
    } else {
        alert("ファイルが開けませんでした。");
    }
}

// レイヤー名に処理に該当する拡張子が含まれているか捜索する
function checkNameExtensions( name ) {
    var len = extensions.length;
    var ret = false;
    for (var i=0; i<len; i++){
        var checkName = extensions[i];
        if( name.indexOf(checkName) > -1 ){
            ret = true;
        }
    }
    return ret;
}


function getGeneratedLayersName( artLayers ) {
    var ret = [];
    var ns = artLayers.length;
    for (var i=0; i<ns; i++){
        var focusLayer = artLayers[i];
        if( checkNameExtensions( focusLayer.name ) ){
            ret.push( focusLayer.name );
        }
    }
    return ret;
}


function allLayerSetsBounds( layObj ){

    var n = layObj.artLayers.length;

    // レイヤーフォルダ内のレイヤー捜索 ////////////////////////////////////////

    // レイヤー名に処理に該当する拡張子が含まれているか捜索する
    var lList = getGeneratedLayersName(layObj.artLayers);
    // あれば1つ1つ捜索しテキスト生成しCSV用テキストへ連結

    var n = lList.length;
    if( n > 0 ) {

        for (var i = 0; i < n; i++) {
            var lname = lList[i];
            var focusLayer = layObj.artLayers.getByName(lname);

            var focusLayerArea = focusLayer.bounds;  // フォーカスエリアを取得
            var x1 = parseInt(focusLayerArea[0]);  // 左上 x座標
            var y1 = parseInt(focusLayerArea[1]);  // 左上 y座標

            var addStr = focusLayer.name + "," + x1 + "," + y1 + ",";  // テキスト生成

            strData += addStr;  // CSV用テキストへ連結
        }
    }
}
