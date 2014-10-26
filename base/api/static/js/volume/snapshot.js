refresh_table_interval = 0;
// two seconds
table_refresh_interval = 2000;

$(document).ready(function() {
    // Highlight top bar
    $("#volume").closest("li").addClass("active");
    $("#sidebar .sidebar-btn:has([href='/volume/" + __("folder_type") + "/'])").addClass('active');

    // Set default period for keeping snapshots
    $("#preserve_period").val(__("preserve_period"));

    // Events
    // Add snapshot
    $("#add_snapshot").click(function(){
        // Initialize modal
        clearInterval(refresh_table_interval)
        loadingUI();

        $.post( __("add_snapshot_url"), function( data ) {
            if (data.result)
                toastr.success(data["msg"])
            else
                toastr.error(data["msg"])
        });
        refresh();

        $.unblockUI();
        refresh_table_interval = setInterval(refresh, table_refresh_interval);
    })

    // Set reserve time of snapshot
    $("#preserve_period").change(function(){
        clearInterval(refresh_table_interval)
        loadingUI();
        $.post( __("preserve_period_url"), {'preserve_period': $(this).val()},function( data ) {
            if (data.result)
                toastr.success(data["msg"])
            else
                toastr.error(data["msg"])

                $.unblockUI();
                refresh_table_interval = setInterval(refresh, table_refresh_interval);
        });
    })

    // Delete events
    $("#delete-btn").click(function(){
        clearInterval(refresh_table_interval)
        $('#modal-delete-snapshot').modal('toggle');
        loadingUI();
        $.post( __("remove_snapshot_url"), {'id': $(".modal-body #delete-target").val()},function( data ) {
            if (data.result)
                toastr.success(data["msg"])
            else
                toastr.error(data["msg"])
            refresh();

            $.unblockUI();
            refresh_table_interval = setInterval(refresh, table_refresh_interval);
        });
    });

    $("#confirm-btn").click(function(){
        clearInterval(refresh_table_interval)
        $("#modal-confirm").modal("toggle");
        loadingUI();
        $.post( __("add_snapshot_url"), function( data ) {
            if (data.result)
                toastr.success(data["msg"])
            else
                toastr.error(data["msg"])
            refresh();

            $.unblockUI();
            refresh_table_interval = setInterval(refresh, table_refresh_interval);
        });
    });

    $('input:checkbox[name="purge"]').change(function(){
        if ($(this).prop("checked"))
            $("#delete-btn").prop("disabled", false);
        else
            $("#delete-btn").prop("disabled", true);
    });

    // Refresh table every 2 seconds
    refresh();
    refresh_table_interval = setInterval(refresh, table_refresh_interval);
});

// Refresh snapshot table and its events
function refresh() {
    // Get folder settings
    $.post( __("snapshot_info_url"), function( data ) {
        // Update add snapshot-icon status
        if (data['result']){
            if (data['data']['queued']){
                $("#add_snapshot").prop("disabled", true);
                $("#add_snapshot").attr("title", __("taking_msg"));
            } else {
                $("#add_snapshot").prop("disabled", false);
                $("#add_snapshot").attr("title", __("take_msg"));
            }
        }
        // Update preserve period status
        $("#preserve_period").val(data['data']['snap_ttl']);
    });

    // Refresh table
    $.ajax({
        url: __("snapshot_table_url"),
        dataType: "html",
        success: function(data) {
            // Reload html of table
            node = document.getElementById("snapshot_body");
            var temp = node.ownerDocument.createElement('div');
            temp.innerHTML = "<table>" + data + "</table>";

            node.parentNode.replaceChild(getFirstChild(getFirstChild(temp)), node);

            // Reload switch style
            $('.switch-mini').bootstrapSwitch();

            // Reload scripts of table
            $(".folder_link").click(function(){
                var folder_name = $(this).data('id');
                if (__("folder_type") == 'cifs'){
                    $("#folder_path").val( "\\\\" + __("ip") + "\\" + folder_name);
                    $("#folder_path_mac").val( "smb://" + __("ip") + "/" + folder_name);
                } else {
                    $("#folder_path").val( __("ip") + ":" + folder_name);
                }
                $("#folder_dialog").dialog({
                  width: 500,
                  resizable: false,
                  closeText: "",
                  modal: true
                });
            });

            $(".delete-dialog-btn").click(function(){
                $('input:checkbox[name="purge"]').prop("checked", false);
                $("#delete-btn").prop("disabled", true);
                var target_id = $(this).data('id');
                $(".modal-body #delete-target").val(target_id);
            });

            $('.switch-mini').on('switch-change', function (e, data) {
                clearInterval(refresh_table_interval)
                loadingUI();

                var id = $(this).data('id');
                $.post( __("toggle_snapshot_url"), {'id': id},function( data ) {
                    if (data.result)
                        toastr.success(data["msg"])
                    else
                        toastr.error(data["msg"])
                    refresh();

                    $.unblockUI();
                    refresh_table_interval = setInterval(refresh, table_refresh_interval);
                });
            });

        }
    });
}

ZeroClipboard.config({ moviePath: "/static/components/zeroclipboard/ZeroClipboard.swf" });
if (__("folder_type") == 'nfs'){
    var client_snapshot = new ZeroClipboard( $("#copy-button-snapshot") );

    client_snapshot.on( 'wrongflash noflash', function() {
        ZeroClipboard.destroy();
        $("#copy-button-snapshot").hide();
    }); 
}
if (__("folder_type") == 'cifs'){
    var client_win = new ZeroClipboard( $("#copy-button-win") );
    var client_mac = new ZeroClipboard( $("#copy-button-mac") );

    client_win.on( 'wrongflash noflash', function() {
        ZeroClipboard.destroy();
        $("#copy-button-win").hide();
    }); 
    client_mac.on( 'wrongflash noflash', function() {
        ZeroClipboard.destroy();
        $("#copy-button-mac").hide();
    });
}

if (/MSIE|Trident/.test(window.navigator.userAgent)) {
  (function($) {
    $.widget( "ui.dialog", $.ui.dialog, {
      _allowInteraction: function( event ) {
        return this._super(event) || $( event.target ).closest( ".global-zeroclipboard-container" ).length;
      }
    } );
  })(window.jQuery);
}

function getFirstChild(el){
  var firstChild = el.firstChild;

  while(firstChild != null && firstChild.nodeType == 3 ){
    // skip TextNodes and input tag
    firstChild = firstChild.nextSibling;
  }

  return firstChild;
}
