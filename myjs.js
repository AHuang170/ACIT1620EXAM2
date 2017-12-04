var enter_keyCode = 13;

var gallery_count = 0;
var gallery_card = "gal_card";
var gallery_to = "gal_to";
var gallery_from = "gal_from";
var gallery_body = "gal_body";
var gallery_arr = [];
var mlink = "http://www.bcitdigitalarts.ca/vote/server/exam.php";
var single_options = 0;
var single_select = false;

var extension_dictionary = {};
var name_length_dictionary = {};

var selected_card = -1;

function append_to_gallery(bg_src, body_text, card_to_text, card_from_text){
    
    var ncard_Div = document.createElement('div');
    var ncard_to_Div = document.createElement('div');
    var ncard_from_Div = document.createElement('div');
    var ncard_body_Div = document.createElement('div');
    
    var curr_gallery_count = gallery_count;
    var gallery_id_head = "gallery_img";
    
    ncard_Div.id = gallery_card + curr_gallery_count;
    ncard_to_Div.id = gallery_to + curr_gallery_count;
    ncard_from_Div.id = gallery_from + curr_gallery_count;
    ncard_body_Div.id = gallery_body + curr_gallery_count;
    
    ncard_Div.className = "gal_card";
    ncard_to_Div.className = "gal_card_to";
    ncard_from_Div.className = "gal_card_from";
    ncard_body_Div.className = "gal_card_body";
    
    ncard_to_Div.innerHTML = card_to_text;
    ncard_from_Div.innerHTML = card_from_text;
    
    ncard_body_Div.style.backgroundImage = "url(" + bg_src+")";
    ncard_body_Div.innerHTML = body_text;
    
    ncard_Div.appendChild(ncard_body_Div);
    ncard_Div.appendChild(ncard_to_Div);
    ncard_Div.appendChild(ncard_from_Div);
    
    ncard_Div.onclick = function(){
        change_selection(curr_gallery_count);
        return_post_card();
    };
    
    document.getElementById("gallery").appendChild(ncard_Div);
    
    var curr_obj = {source: bg_src, body: body_text, cardTo: card_to_text, cardFrom: card_from_text};
    gallery_arr.push(curr_obj);
    gallery_count += 1;
}

function change_selection(input_num){
    selected_card = input_num;
    //console.log(input_num);
}

function return_post_card(){
    
    if(single_options != 0){
        reset_single_options();
        single_options = 0;
        single_select = false;
    }
    
    var sel_src = get_css_value(gallery_body + selected_card, "background-image");
    var sel_body = document.getElementById(gallery_body + selected_card).innerHTML;
    var sel_to = document.getElementById(gallery_to + selected_card).innerHTML;
    var sel_from = document.getElementById(gallery_from + selected_card).innerHTML;
    
    document.getElementById("postcard").style.display = "block";
    document.getElementById("gallery").style.display = "none";
    
    document.getElementById("pc_body").style.backgroundImage = sel_src;
    document.getElementById("pc_to").innerHTML = sel_to;
    document.getElementById("pc_from").innerHTML = sel_from;
    document.getElementById("pc_body").innerHTML = sel_body;
    
}

function get_css_value(element_id, attribute){
    var element = document.getElementById(element_id);
    var ele_style = window.getComputedStyle(element);
    var attr_val = ele_style.getPropertyValue(attribute);
    
    return attr_val;
}

function convert_fetched_arr(input_arr){
    
    var work_arr = input_arr.slice();
    var return_arr = [];
    for (index = 0; index < work_arr.length; index += 1){
        var cnv_obj = {};
        cnv_obj.source = work_arr[index].bgimg;
        cnv_obj.cardTo = work_arr[index].mto;
        cnv_obj.body = work_arr[index].mbody;
        cnv_obj.cardFrom = work_arr[index].mfrom;
        return_arr.push(cnv_obj);
    }
    
    return return_arr;
}

function populate_gallery_by_arr(input_arr){
    var work_arr = input_arr.slice();
    extension_dictionary = {};
    name_length_dictionary = {};
    for(index = 0; index < work_arr.length; index += 1){
        var curr_obj = Object.assign({},work_arr[index]);
        var curr_src = curr_obj.source.slice();
        var curr_to = curr_obj.cardTo.slice();
        var curr_body = curr_obj.body.slice();
        var curr_from = curr_obj.cardFrom.slice();
        if(curr_src.indexOf("(") != -1){
            curr_src = curr_src.slice(curr_src.indexOf("(") + 1, curr_src.indexOf(")"));
        }
        
        append_to_gallery(curr_src, curr_body, curr_to, curr_from);
    }
    
};

function populate_onlinegallery_by_arr(input_arr){
    var work_arr = input_arr.slice();
    extension_dictionary = {};
    name_length_dictionary = {};
    for(index = 0; index < work_arr.length; index += 1){
        var curr_obj = Object.assign({},work_arr[index]);
        var curr_src = curr_obj.source.slice();
        var curr_to = curr_obj.cardTo.slice();
        var curr_body = curr_obj.body.slice();
        var curr_from = curr_obj.cardFrom.slice();
        if(curr_src.indexOf("(") != -1){
            curr_src = curr_src.slice(curr_src.indexOf("(") + 1, curr_src.indexOf(")"));
        }
        
        append_to_gallery(curr_src, curr_body, curr_to, curr_from);
        populate_extension_dictionary(curr_src);
        populate_name_length_dictionary(curr_to);
        populate_name_length_dictionary(curr_from);
        
    }
    setTimeout(function(){
        alert_dictionary_stats();
    }, 100);
    
    
};

function populate_extension_dictionary(input_src){
    var fileName = input_src.slice();
    var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
    if(fileName.lastIndexOf('.') == -1){
        ext = "";
    }
    
    if(ext.indexOf('"') != -1){
        ext = ext.slice(0, ext.indexOf('"'));
    }
    
    if(ext == ""){
        ext = "UNIDENTIFIED";
    }
    else if(ext.indexOf("&") != -1){
        ext = ext.slice(0, ext.indexOf("&"));
    }
    
    
    
    if(!(ext in extension_dictionary)){
        extension_dictionary[ext] = 1;
    }
    else{
        var curr_val = extension_dictionary[ext];
        var curr_val = curr_val + 1;
        extension_dictionary[ext] = curr_val;
    }
    
}

function populate_name_length_dictionary(input_txt){
    var curr_text = input_txt.slice();
    if(curr_text.startsWith("To")){
        curr_text = curr_text.slice(2);
    }
    else if(curr_text.startsWith("to")){
        curr_text = curr_text.slice(2);
    }
    else if(curr_text.startsWith("TO")){
        curr_text = curr_text.slice(2);
    }
    else if(curr_text.startsWith("From")){
        curr_text = curr_text.slice(4);
    }
    else if(curr_text.startsWith("from")){
        curr_text = curr_text.slice(4);
    }
    else if(curr_text.startsWith("FROM")){
        curr_text = curr_text.slice(4);
    }
    
    if(curr_text.indexOf(":") != -1){
        curr_text = curr_text.replace(":", "");
    }
    
    while(curr_text.startsWith(" ")){
        curr_text = curr_text.slice(1);
    }
    
    
    var text_length = curr_text.length;
    var key_name = text_length + " letter names"
    
    if(!(key_name in name_length_dictionary)){
        name_length_dictionary[key_name] = 1;
    }
    else{
        var curr_val = name_length_dictionary[key_name];
        var curr_val = curr_val + 1;
        name_length_dictionary[key_name] = curr_val;
    }
    
}

function alert_dictionary_stats(){
    var ext_dict = Object.assign({}, extension_dictionary);
    var ext_keys = Object.keys(ext_dict).slice();
    var len_dict = Object.assign({}, name_length_dictionary);
    var len_keys = Object.keys(len_dict).slice();
    
    len_keys = sort_name_length_key(len_keys).slice();
    
    var alert_string = "Number of each image type:\n";
    
    for(var index = 0; index < ext_keys.length; index += 1){
        var new_substr = ext_keys[index] + ": " + ext_dict[ext_keys[index]] + "\n";
        alert_string += new_substr;
    }
    
    alert_string += "\nNumber of each name length:\n"
    
    for(var i = 0; i < len_keys.length; i += 1){
        var new_substring = len_keys[i] + ": " + len_dict[len_keys[i]] + "\n";
        alert_string += new_substring;
    }
    
    alert(alert_string);
    
}

function sort_name_length_key(input_arr){
    var work_arr = input_arr.slice();
    var new_arr = [];
    
    for(var index = 0; index < work_arr.length; index += 1){
        var new_val = parseInt(work_arr[index]);
        new_arr.push(new_val);
    }
    new_arr = new_arr.sort(function(a, b){return a-b});
    
    var result_arr = [];
    for(var i = 0; i < new_arr.length; i += 1){
        var result_key = new_arr[i] + " letter names";
        result_arr.push(result_key);
    }
    
    return result_arr;
    
}

function update_all_pc(){
    if(single_select){
        return;
    }
    document.getElementById("pc_body").style.backgroundImage = "url(" + document.getElementById("pc_url").value + ")";
    document.getElementById("pc_to").innerHTML = document.getElementById("pc_to_txt").value;
    document.getElementById("pc_from").innerHTML = document.getElementById("pc_from_txt").value;
    document.getElementById("pc_body").innerHTML = document.getElementById("pc_body_txt").value;
    document.getElementById("card_controls").style.display = "none";
    
    update_gall_src();
    update_gall_body();
    update_gall_to();
    update_gall_from();
}

function update_gall_src(){
    if(selected_card == -1){
        return;
    }
    
    var sel_src = get_css_value("pc_body", "background-image");
    document.getElementById(gallery_body + selected_card).style.backgroundImage = sel_src;
}

function update_gall_body(){
    if(selected_card == -1){
        return;
    }
    
    var sel_body = document.getElementById("pc_body").innerHTML;
    document.getElementById(gallery_body + selected_card).innerHTML = sel_body;
}

function update_gall_to(){
    if(selected_card == -1){
        return;
    }
    
    var sel_to = document.getElementById("pc_to").innerHTML;
    document.getElementById(gallery_to + selected_card).innerHTML = sel_to;
    
}

function update_gall_from(){
    if(selected_card == -1){
        return;
    }
    
    var sel_from = document.getElementById("pc_from").innerHTML;
    document.getElementById(gallery_from + selected_card).innerHTML = sel_from;
}

function erase_gallery(){
    for(var index = 0; index < gallery_arr.length; index +=1){
        document.getElementById("gallery").removeChild(document.getElementById(gallery_card + index));
    }
}

function reset_post(){
    document.getElementById("pc_to").innerHTML = "To";
    document.getElementById("pc_from").innerHTML = "From";
    document.getElementById("pc_body").innerHTML = "";
    document.getElementById("pc_body").style.backgroundImage = "url(img/default.png)";
}

function reset_single_options(){
    document.getElementById("pc_src_single_txt").style.display = 'none';
    document.getElementById("pc_body_single_txt").style.display = 'none';
    document.getElementById("pc_to_single_txt").style.display = 'none';
    document.getElementById("pc_from_single_txt").style.display = 'none';
}

document.getElementById("nav_post").addEventListener("click", function(){
    if(single_options != 0){
        reset_single_options();
        single_options = 0;
        single_select = false;
    }
    
    document.getElementById("postcard").style.display = "block";
    document.getElementById("gallery").style.display = "none";
    reset_post();
});

document.getElementById("nav_gall").addEventListener("click", function(){
    document.getElementById("gallery").style.display = "block";
    document.getElementById("postcard").style.display = "none";
    selected_card = -1;
});

document.getElementById("card").addEventListener("click", function(){
    if(single_select != true){
        document.getElementById("card_controls").style.display = "block";
    }
    
});

document.getElementById("pc_url").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        single_select = false;
        update_all_pc();
    }
});

document.getElementById("pc_to_txt").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        single_select = false;
        update_all_pc();
    }
    
});

document.getElementById("pc_from_txt").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        single_select = false;
        update_all_pc();
    }
    
});

document.getElementById("pc_body_txt").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        single_select = false;
        update_all_pc();
    }
    
});

document.getElementById("add").addEventListener("click", function(){
    
    var raw_cd_src = get_css_value("pc_body", 'background-image');
    var cd_src = raw_cd_src.slice(raw_cd_src.indexOf("(") + 1, raw_cd_src.indexOf(")"));
    var cd_bd_txt = document.getElementById("pc_body").innerHTML;
    var cd_to_txt = document.getElementById("pc_to").innerHTML;
    var cd_from_txt = document.getElementById("pc_from").innerHTML;
    if(selected_card == -1){
        append_to_gallery(cd_src, cd_bd_txt, cd_to_txt, cd_from_txt);
    }
    else{
        document.getElementById(gallery_to + selected_card).innerHTML = cd_to_txt;
        document.getElementById(gallery_from + selected_card).innerHTML = cd_from_txt;
        document.getElementById(gallery_body + selected_card).style.backgroundImage = cd_src;
        document.getElementById(gallery_body + selected_card).innerHTML = cd_bd_txt;
        
        gallery_arr[selected_card].body = cd_bd_txt;
        gallery_arr[selected_card].cardTo = cd_to_txt;
        gallery_arr[selected_card].cardFrom = cd_from_txt;
        gallery_arr[selected_card].source = cd_src;
        
    }
    
});

document.getElementById("gal_saOn").addEventListener("click", function(){
    var input_arr = gallery_arr.slice();
    
    for(var index = 0; index < input_arr.length; index += 1){
        var mdata = new FormData();
        var currObj = Object.assign({}, input_arr[index]);
        
        mdata.append("type", "insert");
        mdata.append("bgimg", currObj.source);
        mdata.append("mto", currObj.cardTo);
        mdata.append("mbody", currObj.body);
        mdata.append("mfrom", currObj.cardFrom);
        
        fetch(mlink, {
            method: "POST",
            body:mdata
        }).then((resp)=>{
            return resp.json();
        }).then((json)=>{
            console.log(json);
        });
    }

});

document.getElementById("gal_loOn").addEventListener("click", function(){
    var mdata = new FormData();
    selected_card = -1;
    mdata.append("type", "read");
    
    fetch(mlink, {
        method: "POST",
        body: mdata
    }).then((resp)=>{
        return resp.json();
    }).then((json)=>{
        //console.log(json);
        erase_gallery();
        gallery_arr = [];
        gallery_count = 0;
        var arr=json.data;
        var new_arr = convert_fetched_arr(arr);
        var display_img_arr = new_arr.slice();
        populate_onlinegallery_by_arr(new_arr);
        
    });
});

document.getElementById("gal_saLo").addEventListener("click", function(){
    var work_arr = gallery_arr.slice();
    var arrText = JSON.stringify(work_arr);
    localStorage.setItem("items", arrText);

});

document.getElementById("gal_loLo").addEventListener("click", function(){
    erase_gallery();
    gallery_arr = [];
    gallery_count = 0;
    var arrText = localStorage.getItem("items");
    var arr = JSON.parse(arrText);
    selected_card = -1;
    populate_gallery_by_arr(arr);
});

document.getElementById("pc_to").addEventListener("click", function(){
    single_select = true;
    document.getElementById("pc_to_single_txt").style.display = 'block';
    single_options += 1;
});


document.getElementById("pc_single_to_txt").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        document.getElementById("pc_to").innerHTML = document.getElementById("pc_single_to_txt").value;
        document.getElementById("pc_to_single_txt").style.display = 'none';
        single_options -= 1;
        update_gall_to();
        if(single_options == 0){
            single_select = false;
        }
        
    }
});

document.getElementById("pc_from").addEventListener("click", function(){
    single_select = true;
    document.getElementById("pc_from_single_txt").style.display = 'block';
    single_options += 1;
});

document.getElementById("pc_single_from_txt").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        document.getElementById("pc_from").innerHTML = document.getElementById("pc_single_from_txt").value;
        document.getElementById("pc_from_single_txt").style.display = 'none';
        single_options -= 1;
        update_gall_from();
        if(single_options == 0){
            single_select = false;
        }
    }
});

document.getElementById("pc_body").addEventListener("click", function(){
    single_select = true;
    document.getElementById("pc_body_single_txt").style.display = 'block';
    document.getElementById("pc_src_single_txt").style.display = 'block';
    single_options += 2;
});

document.getElementById("pc_single_body_txt").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        document.getElementById("pc_body").innerHTML = document.getElementById("pc_single_body_txt").value;
        document.getElementById("pc_body_single_txt").style.display = 'none';
        single_options -= 1;
        update_gall_body();
        if(single_options == 0){
            single_select = false;
        }
    }
});

document.getElementById("pc_single_src_txt").addEventListener("keyup", function(ev){
    if(ev.keyCode == enter_keyCode){
        
        document.getElementById("pc_body").style.backgroundImage = "url(" + document.getElementById("pc_single_src_txt").value + ")";
        document.getElementById("pc_src_single_txt").style.display = 'none';
        update_gall_src();
        single_options -= 1;
        if(single_options == 0){
            single_select = false;
        }
    }
});