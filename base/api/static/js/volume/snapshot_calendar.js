var currentForm;

$(document).ready(function() {

    // Init
    $("#volume").closest("li").addClass("active");
    $("#sidebar .sidebar-btn:has([href='/volume/" + __("folder_type") + "/'])").addClass('active');
    time_select = document.getElementById('time_select')
    create_time_select(time_select, 0, 23);
    if (__("calendar_type") == "schedule")
        $("#time_select").val(__("calendar_time"))

    if( $("input[name='calendar_type']:checked").val() != "schedule")
        $('#time_select').prop('disabled', 'disabled');
    
    // Events
    $("input[name='calendar_type']").change(function(){
        if( $("input[name='calendar_type']:checked").val() != "schedule")
            $('#time_select').prop('disabled', 'disabled');
        else
            $('#time_select').prop('disabled', false);
    });

    if (__("is_optimize") == "True"){
        $("#form_calendar").submit(function(){
            currentForm = this;
            $("#modal-confirm").modal("show");
            return false
        });

        $("#confirm-btn").click(function(){
            $("#modal-confirm").modal("hide");
            currentForm.submit();
        });
    }
});

function remove_select(select_id){
    for (var i=select_id.length-1; i>=0; i--)
        select_id.remove(i)
};

function create_time_select(select_id, start, end){
    remove_select(select_id)

    for (var i=start;i< end+1; i++){
        if (i < 10)
            data = "0" + i + ":00" 
        else
            data = i + ":00"
        var new_option = new Option(data, i);
        select_id.options.add(new_option);
    }
};
