$.fn.popover.defaults.container = 'body';
$.fn.popover.defaults.trigger = 'hover';
$.fn.popover.defaults.placement = 'bottom';

$.resetModal = function () {
  $("#form-add-nfs").find('input[type=text], input[type=password], textarea').val('');
  $("#form-add-nfs").find('input[type=checkbox]').prop('checked', false);
  $(".modal-body #create_permission").val("rw");
};

$(document).ready(function() {

  var csrftoken = getCookie('csrftoken');

  var data_opt = {
    "sDom": "<'row-fluid'<'span8 toolbar'><'span4'f>><'row-fluid'<'span7 other_toolbar'i><'span5 paginate_top'rp>><'row-fluid'<'span12't>><'row-fluid'<'span7'><'span5 paginate_bottom'p>>",
    "sPaginationType": "bootstrap",
    "oLanguage": {
        "sSearch": "<div class='input-append'>_INPUT_<button class='btn btn-mini' disabled></button></div>",
        "sZeroRecords": __("empty_message"),
        "sInfo": __("information_message"),
        "sInfoEmpty": __("information_message"),
        "sInfoFiltered": ""
    },
    "iDisplayLength": 10,
    "bInfo": true,
    "bDestroy": true,
    "asStripeClasses": [],
    "aoColumnDefs": [
        {"bSortable": true, "bSearchable": true, "aTargets": [1, 2]},
        {"bSortable": false, "bSearchable": false, "aTargets": [0, 3, 4, 5, 6]}
    ]
  };

  folder_dataTable = $('#nfs_export').dataTable(data_opt);
  a = '<a id="nfs-create-btn" class="btn btn-icon btn-small btn-hopebay"><span class="hopebay-icon btn-icon-add-folder"></a>'
  $('div.toolbar').html(a);
  $("[data-toggle=popover]").popover();

  $("#volume").closest("li").addClass("active");
  $('.switch-mini').bootstrapSwitch();
  $("#folder_dialog").dialog({
    autoOpen: false,
    width: 400,
    resizable: false,
    closeText: "",
    modal: true
  });
  

  $.ajaxSetup({
    crossDomain: false,
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type)) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });
  
  $('.switch-mini').on('switch-change', function (e, data) {
    loadingUI();
    var folder_name = $(this).data('id');
    $.post(
      __("volume_nfs_toggle"),
      {"folder_name": folder_name}
    )
    .done(function(data){
      $.unblockUI();
      if (data["result"]) {
        toastr.success(data["msg"]);
      }
      else {
        toastr.error(data["msg"]);
      }
    });
  });

  var form_validator = $('#form-add-nfs').validate({
    onfocusout: false,
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      $(label).closest('.control-group').removeClass('error');
    },
    onkeyup: function(element){
      form_validator.element(element)
      $('#add-nfs-submit').prop('disabled', !form_validator.checkForm());
    },
    submitHandler: function(form) {
      form.submit();
      $("#modal-add-nfs").modal('toggle');
    },
  });

  var edit_form_validator = $('#form-edit-nfs').validate({
    onfocusout: false,
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      $(label).closest('.control-group').removeClass('error');
    },
    onkeyup: function(element){
      edit_form_validator.element(element)
      $('#edit-nfs-submit').prop('disabled', !edit_form_validator.checkForm());
    },
    submitHandler: function(form) {
      form.submit();
      $("#modal-edit-nfs").modal('toggle');
    },
  });
  
  $(".modal").on('shown', function() {
    $(this).find("[autofocus]:first").focus();
  });
  
  $("#modal-add-nfs").on('hidden', function() {
    $.resetModal(); 
    form_validator.resetForm();
  });
  
  $("#modal-edit-nfs").on('hidden', function() {
    edit_form_validator.resetForm();
  });
  
  if (mode == "starter" && parseInt(cur_folders) >= parseInt(max_folders) ) {
    $("#nfs-create-btn").attr('disabled', 'disabled');
    $("#nfs-create-btn").click(function() { return false; } );
    $("#nfs-create-btn").popover({
      content: __("folder_limit"),
    });
  }
  else {
    $("#nfs-create-btn").popover({
      content: __('create_folder_tooltip'),
    });
    $("#nfs-create-btn").click(function() {
      $('#add-nfs-submit').prop('disabled', true);
      //$('#modal-add-nfs').modal('show');
      $('#modal-add-nfs').modal({ backdrop: 'static', keyboard: true });
    });
  }

  $("#add-nfs-submit").click(function(){
    if (form_validator.form()) {
      loadingUI();
    }
  });

  $("#edit-nfs-submit").click(function(){
    if (edit_form_validator.form()) {
      loadingUI();
    }
  });

  $("#form-remove-nfs").submit(function() {
    $('#modal-delete-nfs').modal('toggle');
    loadingUI();
  });

  // bind delete button to folder
  $(".delete-dialog-btn").click(function(){
    $('input:checkbox[name="purge"]').prop("checked", false);
    $(".delete-btn").prop("disabled", true);
    var folder_name = $(this).data('id');
    $(".modal-body #delete-target").val(folder_name);
    $("#modal-delete-nfs .modal-body p b").text(folder_name);
  });

  $(".edit-dialog-btn").click(function(){
    var folder_name = $(this).data('id');
    $(".modal-body #modal_edit_folder_name").val(folder_name);
    var ip_list = $(this).data('ip');
    $(".modal-body #modal_edit_hosts_allow").val(ip_list);
    var permission = $(this).data('permission');
    $(".modal-body #edit_permission").val(permission);
    $("#hidden_permission").val(permission);
    var readonly = $(this).data('readonly');
    if (readonly == "1") {
      $(".modal-body #edit_permission").prop("disabled", true);
      $("#hidden_permission").prop("disabled", false);
      $("#modal-edit-nfs i").show();
    }
    else {
      $(".modal-body #edit_permission").prop("disabled", false);
      $("#hidden_permission").prop("disabled", true);
      $("#modal-edit-nfs i").hide();
    }
  });

  $(".folder_link").click(function(){
    var folder_path = $(this).data('id');
    var folder_name = $(this).data('name');
    $("#folder_path").val( __("nfs_info_ip") + folder_path);
    $("#full_path").text(folder_name);
    $("#folder_dialog").dialog("open");
  });
  
  $('input:checkbox[name="purge"]').change(function(){
    if ($(this).prop("checked"))
      $(".delete-btn").prop("disabled", false);
    else
      $(".delete-btn").prop("disabled", true);
  });

  $('#edit-nfs-submit').prop('disabled', true);
});
    
ZeroClipboard.config({ moviePath: "/static/components/zeroclipboard/ZeroClipboard.swf" });

var client_nfs = new ZeroClipboard( $("#copy-button-nfs") );

client_nfs.on( 'wrongflash noflash', function() {
    ZeroClipboard.destroy();
    $("#copy-button-nfs").hide();
}); 

if (/MSIE|Trident/.test(window.navigator.userAgent)) {
  (function($) {
    $.widget( "ui.dialog", $.ui.dialog, {
      _allowInteraction: function( event ) {
        return this._super(event) || $( event.target ).closest( ".global-zeroclipboard-container" ).length;
      }
    } );
  })(window.jQuery);
}

